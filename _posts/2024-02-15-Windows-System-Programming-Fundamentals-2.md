---
layout: post
title:  "Windows System Programming: Fundamentals II"
date:   2024-05-13  07:29:20 +0700
tags: [windows]
categories: jekyll update
usemathjax: true
---

Continuation of the windows blog series.
I have posted the part one about [Windows Internals Theory.](https://arorarachit.com/blog/windows-system-programming-fundamentals)

### Contents

- [Objects and handles](#objects-and-handles)
- [Handles Usage](#handles-usage)
- [Pseudo Handles](#pseudo-handles)
- [Sharing Objects](#sharing-objects)
- [Objects Names and Sessions](#objects-names-and-sessions)
- [Handle Inheritance](#handle-inheritance)
- [User and GDI Objects](#user-and-gdi-objects)


> ## Objects and handles

- Windows processes manage and reference system resources through handles. Each process possesses a distinct **handle** table, and upon creation or opening of an object, a handle is allocated which acts as an indirect reference to the object, facilitating the sharing of objects amongst processes. 

- There are **tools** for observing process handles, such as Process Explorer, handle.exe available from Sysinternals, Resource Monitor which displays named objects, and System Explorer which can be found on GitHub.

  - Windows is designed as an **object-oriented system**, where everything is represented as objects, such as processes, threads, and files.
  - The **kernel**, which is the core part of the operating system, manages these objects and makes them available to the system.
  - The objects are stored in a protected area known as **system space**, which is not directly accessible from the **user space** (the area where normal applications run).
  - These kernel objects have a **system of reference counting**, which means the system keeps track of how many references or handles are linked to each object to manage their lifecycle.
  - Code that runs in kernel mode has the privilege to **directly access** these objects, unlike user mode processes which interact with the objects indirectly through handles. 
  - Handles are like **references or pointers** provided to user mode processes that allow them to use these objects in a controlled manner.

[![image.png](https://i.postimg.cc/Kvs05Q7n/image.png)](https://postimg.cc/6ynVWrm3)

- The value assigned to a handle is always a multiple of four, and zero is not considered a valid value for a handle. To view more details about an item, one should perform a double-click action and then select 'Properties'.

[![image.png](https://i.postimg.cc/bNGxqPbt/image.png)](https://postimg.cc/nCJj163F)


- The **access mask** indicates the permissions or types of operations that are permitted through a particular handle. Each handle grants a specific level of access to a resource or object.

> ### _Showing Unnamed handles and Mappings_

[![image.png](https://i.postimg.cc/8507YFZn/image.png)](https://postimg.cc/62C62QJd)

- Now, Unnamed handles are visible

[![image.png](https://i.postimg.cc/RFycHbxF/image.png)](https://postimg.cc/phQhNCTb)


- The kernel have direct pointers to the object, bypassing the need for handles, which are only necessary in user mode. An object having more handles implies it is being accessed by multiple users or processes. 


[![image.png](https://i.postimg.cc/7ZnMWV0s/image.png)](https://postimg.cc/mPhHc7dC)


- Certain objects are exclusively accessible and utilized by the kernel, not available to user mode.




> ### _Objects which are exposed by Windows API_

| **Object**                       | **Creation**             | **Access**               |
|-----------------------------------|--------------------------|--------------------------|
| **Process**                       | _CreateProcess_          | _OpenProcess_            |
| **Thread**                        | _CreateThread_           | _OpenThread_             |
| **Job**                           | _CreateJobObject_        | _OpenJobObject_          |
| **File**                          | _CreateFile_             | _CreateFile2_            |
| **File Mapping (Section)**        | _CreateFileMapping_      | _OpenFileMapping_        |
| **Token**                         | _LogonUser_              | _OpenProcessToken_       |
| **Mutex (Mutant)**                | _CreateMutex(Ex)_        | _OpenMutex_              |
| **Event**                         | _CreateEvent(Ex)_        | _OpenEvent_              |
| **Semaphore**                     | _CreateSemaphore_        | _OpenSemaphore_          |
| **Timer**                         | _CreateWaitableTimer_    | _OpenWaitableTimer_      |
| **I/O Completion Port**           | _CreateIoCompletionPort_ | -                        |
| **Window Station**                | _CreateWindowStation_    | _OpenWindowStation_      |
| **Desktop**                       | _CreateDesktop_          | _OpenDesktop_            |


> ## Handles Usage

- User mode processes obtain a handle by using a **Create*** function or an **Open*** function.
- A successful operation returns a handle, while a failure results in NULL or INVALID_HANDLE_VALUE.
- When a handle is no longer required, it should be closed using the CloseHandle API, which removes the entry from the handle table and decrements the object's reference count.
- If the reference count reaches zero, the object is deleted.


If we do not close handle, we are leaking handle which essentially mean we are wasting memory


> **Example**

```cpp
#include <stdio.h>
#include <Windows.h>

int main() {
    HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);
    if (hEvent == nullptr) {
        printf("Failed to create event (%lu)\n", ::GetLastError());
    }
    else {
        ::SetEvent(hEvent);
        ::CloseHandle(hEvent);
    }

    //::SetPriorityClass(::GetCurrentProcess(), HIGH_PRIORITY_CLASS);
    return 0;
}
```

Explanation:

1. **_HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);_:** This line declares a handle to an event object and attempts to create the event using CreateEvent. The parameters are as follows:

2. **_nullptr_:** for security attributes, indicating default security.

3. **_TRUE_:** indicates that the event is **manual-reset**, meaning the SetEvent function must be called to return the event object to the nonsignaled state.

4. **_FALSE_:** indicates the initial state of the event object is nonsignaled.

5. **_nullptr:_** for the name of the event, indicating it is unnamed.

6.  **_::SetEvent(hEvent);_:** This function sets the event object to the signaled state. Any threads waiting for the event would be released if the event were being waited on.

7. **_::CloseHandle(hEvent);_:** This function closes the handle to the event object. When no more handles to the event object exist, the system can free the event object's resources.

> **Key Takeaways From Example 1**

- Initiate debugging by pressing F12 to place a breakpoint and set the project as the startup project.
- Begin execution, and when the breakpoint at the main function is hit, step through each line to monitor the behavior.
- Search for the AC handle to examine its properties.


[![image.png](https://i.postimg.cc/tRz6yTYJ/image.png)](https://postimg.cc/qgzqxpcH)

- Identify the event type as "notification," indicating it's a manual-reset event.
- Note that the initial state of "signalled false" means the event starts as nonsignaled.

[![image.png](https://i.postimg.cc/mDBr6Y3w/image.png)](https://postimg.cc/8FXD7r0J)|

- Execute the **SetEvent** function to change the event's state.
- Observe the transition to "signalled true," which confirms the event's state has been altered.

[![image.png](https://i.postimg.cc/hvHWNgWB/image.png)](https://postimg.cc/bSHB27wC)

- Upon closing the handle, the associated visual indicator will turn red and disappear, indicating the handle is no longer valid.

[![image.png](https://i.postimg.cc/xjGZ2Kvm/image.png)](https://postimg.cc/V56g90Hs)

- Any subsequent attempt to reference the event handle will result in an "invalid handle" error because the handle has been closed.

> ## Pseudo Handles

Regular valid handles in Windows are multiples of four, with the first valid handle value being 4.
Pseudo handles are assigned specific values and cannot be closed like normal handles. 

These include:
  - **GetCurrentProcess** with a value of -1, representing the current process.
  - **GetCurrentThread** with a value of -2, representing the current thread.

For Windows 8 and newer versions, there are additional pseudo handles:
  - **GetCurrentProcessToken** with a value of -4, for the token of the current process.
  - **GetCurrentThreadToken** with a value of -5, for the token of the current thread.
  - **GetCurrentThreadEffectiveToken** with a value of -6, for the token of the current thread if it is impersonating; if not, it represents the token of the process.

All tokens are accessible with **TOKEN_QUERY** and **TOKEN_QUERY_SOURCE** permissions only.

```cpp
::SetPriorityClass(::GetCurrentProcess(), HIGH_PRIORITY_CLASS);
```

- Typically, processes in Windows operate at a normal priority level.
- The **GetCurrentProcess** function retrieves a pseudo handle to the currently running process.
- Instead of the more complex operations done previously, we can set a breakpoint and execute this line to increase the process's priority level.
- By executing this code, we can observe whether our process's priority is set to high.
- This demonstrates that using pseudo handles is straightforward and avoids complexity.


> ## Sharing Objects


Handles are specific to the process that created them
There are occasions where objects must be accessible across different processes

- Objects can be shared using various methods:
  - Through inheriting handles when a new child process is spawned by a parent process
  - By accessing an object using its name, which is the easiest method
  - By creating a duplicate of a handle, which is a more universal approach but can be more complex to implement in practice


> **Understanding the wmplayer Example**

When we launch **Windows Media Player (wmplayer)**, it creates a named object (likely a mutex) to check for an existing instance of itself. 
  - If another instance of the player is already running, the application detects the existing named object and does not start a new instance, preventing multiple instances from running simultaneously.

This mechanism involves creating a named synchronization object, such as a **mutex**, which acts as a signal for the application to recognize an active instance. 
  - If the application tries to create a mutex that already exists, it knows another process is running and will typically close or not start a new process.

[![image.png](https://i.postimg.cc/Fzvy9CtJ/image.png)](https://postimg.cc/9RxRbpQW)

Using tools like Process Explorer, which utilize kernel drivers, you can close handles directly. This bypasses the need for the application's **CloseHandle** function. 
  - After closing the handle to the named object, if you try to run Windows Media Player again, it will start because it no longer detects an active instance signaled by the named object.

> **Creating a single instance application**


```cpp
#include <Windows.h>
#include <stdio.h>

int main() {
    HANDLE hMutex = ::CreateMutex(nullptr, FALSE, L"MySingleInstanceMutex");
    if (!hMutex) {
        printf("Error creating mutex!\n");
        return 1;
    }

    if (::GetLastError() == ERROR_ALREADY_EXISTS) {
        printf("Second instance ... shutting down\n");
        return 0;
    }

    printf("First instance ... \n");
    char dummy[4];
    gets_s(dummy);

    ::CloseHandle(hMutex);
}
```

This C++ code is a Windows application that ensures only a single instance of it runs at any given time:

1. **_HANDLE hMutex = ::CreateMutex(nullptr, FALSE, L"MySingleInstanceMutex");_**  
This line attempts to create a mutex named "MySingleInstanceMutex". If the mutex already exists, the function will return a handle to the existing mutex instead of creating a new one.

2. **_if (::GetLastError() == ERROR_ALREADY_EXISTS) {_**  
The program checks if the last error code is ERROR_ALREADY_EXISTS, which means the mutex was already created by another instance of the program.

3. **_char dummy[4];_**  
**_gets_s(dummy);_**  
These lines declare a buffer and then use gets_s to wait for user input. This is a simple way to keep the program running so you can observe its behavior.

4. **_::CloseHandle(hMutex);_**  
Finally, before the program ends, it closes the handle to the mutex, releasing the resource.

> **Sharing by Name**

```cpp
#include <Windows.h>
#include <stdio.h>
#include <conio.h>

void Read(void* p);
void Write(void* p);

int Error(const char* msg) {
    printf("%s (%u)\n", msg, ::GetLastError());
    return 1;
}

int main() {
    HANDLE hMemMap = ::CreateFileMapping(INVALID_HANDLE_VALUE, nullptr, PAGE_READWRITE, 0, 1 << 16, L"MySharedMemory");
    if (!hMemMap)
        return Error("Failed to create shared memory");

    void* p = ::MapViewOfFile(hMemMap, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, 0);
    if (!p)
        return Error("Failed in MapViewOfFile");

    printf("Address: 0x%p\n", p);

    bool quit = false;
    while (!quit) {
        printf("1=write, 2=read, 0=quit: ");
        int selection = _getch();
        printf("%c\n", selection);

        switch (selection) {
        case '1':
            Write(p);
            break;

        case '2':
            Read(p);
            break;

        case '0':
            quit = true;
            break;
        }
    }

    ::UnmapViewOfFile(p);
    ::CloseHandle(hMemMap);
    return 0;

    // Presumably you would have more code here to utilize Read and Write functions
}

void Read(void* p) {
    printf("%s\n", (const char*)p);
}

void Write(void* p) {
    printf(">> ");
    char text[128];
    gets_s(text);
    strcpy_s((char*)p, _countof(text), text);
}
```

This allows us to share memory between processes

Explanation:

1. **_HANDLE hMemMap_**: This declares a handle to a file mapping object. It is initialized by the CreateFileMapping function.
   
2. **_INVALID_HANDLE_VALUE_**: This is a constant indicating that the file mapping object is not backed by any existing file on disk.

3. **_PAGE_READWRITE_**: This constant specifies the protection for the file mapping object, allowing both reading and writing to the memory.

4. **_void* p_**: This declares a void pointer p which will hold the starting address of the mapped view of the file.

5. **_CreateFileMapping_**: This function creates or opens a named or unnamed file mapping object for a specified file.

6. **_MapViewOfFile_**: This function maps a view of a file mapping into the address space of the calling process.

7. **_FILE_MAP_READ FILE_MAP_WRITE_**: This constant specifies the type of access to the file mapping object, allowing both reading and writing to the memory.

[![image.png](https://i.postimg.cc/02Qvt83h/image.png)](https://postimg.cc/dDzg3KJ9)

[![image.png](https://i.postimg.cc/d0zDF7M7/image.png)](https://postimg.cc/HJ9T4kkH)



> ## Objects Names and Sessions

In terminal server environments, each session is isolated and has its own set of objects. 

- The object manager organizes these by creating a specific directory for each session identified by its session ID. 
- Within these directories, named objects relevant to each session are created, with the naming being automatically prefixed to ensure session-specific access. 
- Additionally, objects from session zero, which is the default session, can be accessed by other sessions by using the prefix "Global\" when naming objects to obtain handles.

There must be a way to hide these objects because they are visible anywhere

> **BaseNamedObjects**

- The term "BaseNamedObjects" refers to the collection of all named objects that are active in your current session. 
- These objects are distinct because they have been given specific names.
- Session 0 is unique and serves as the primary session in which system services and other critical processes run. 
- The named objects within Session 0 are housed in the BaseNamedObjects directory, located at the root ("/") directory.
- Objects that reside in Session 0 can be made accessible to other sessions, allowing for the sharing of resources across different user sessions.

> **Private Object Namespaces**

Standard object names in Windows are public and can be easily identified and located with various tools or through code. 

- However, starting with Windows Vista, the operating system introduced the concept of private object namespaces which are not visible publicly. 
- These private namespaces enhance security by allowing further restrictions based on Security Identifiers (SIDs) or the integrity level of processes.
  - To manage these private namespaces, Windows provides specific Application Programming Interfaces (APIs) such as _CreateBoundaryDescriptor, AddSIDToBoundaryDescriptor, CreatePrivateNamespace, OpenPrivateNamespace, and ClosePrivateNamespace._

```cpp
#define PRIVATE_NAMESPACE "MyPrivateNamespace"
#include<Windows.h>
#include<stdio.h>
#include<conio.h>

void Write(void* p);
void Read(void* p);

int Error(const char* msg) {
    printf("%s (%u)\n", msg, ::GetLastError());
    return 1;
}

int main() {
    // create the boundary descriptor
    HANDLE hBD = ::CreateBoundaryDescriptor(L"MyDescriptor", 0);
    if (!hBD)
        return Error("Failed to create boundary descriptor");

    BYTE sid[SECURITY_MAX_SID_SIZE];
    auto psid = (PSID)sid;
    DWORD sidLen;
    if (!::CreateWellKnownSid(WinBuiltinUsersSid, nullptr, psid, &sidLen))
        return Error("Failed to create SID");

    if (!::AddSIDToBoundaryDescriptor(&hBD, psid))
        return Error("Failed to add SID to Boundary Descriptor");

    HANDLE hNamespace = ::CreatePrivateNamespace(nullptr, hBD, L"PRIVATE_NAMESPACE");
    if (!hNamespace) { // maybe created already?
        hNamespace = ::OpenPrivateNamespace(hBD, L"PRIVATE_NAMESPACE");
        if (!hNamespace)
            return Error("Failed to create/open private namespace");
    }

    HANDLE hMemMap = ::CreateFileMapping(INVALID_HANDLE_VALUE, nullptr, PAGE_READWRITE, 0, 1 << 16, PRIVATE_NAMESPACE L"\\MySharedMemory");
    if (!hMemMap)
        return Error("Failed to create/open shared memory");

    void* pBuffer = ::MapViewOfFile(hMemMap, FILE_MAP_READ | FILE_MAP_WRITE, 0, 0, 0);
    if (!pBuffer)
        return Error("Failed to map shared memory");

    printf("PID: %u. Shared memory created/opened (H=%p) mapped to %p\n",
        ::GetCurrentProcessId(), hMemMap, pBuffer);

    bool quit = false;
    while (!quit) {
        printf("1=write, 2=read, 0=quit: ");
        int selection = _getch();
        printf("%c\n", selection);

        switch (selection) {
        case '1':
            Write(pBuffer);
            break;

        case '2':
            Read(pBuffer);
            break;

        case '0':
            quit = true;
            break;
        }
    }

    ::UnmapViewOfFile(pBuffer);
    ::CloseHandle(hMemMap);
    return 0;

    // Presumably you would have more code here to utilize Read and Write functions
}

void Read(void* p) {
    printf("%s\n", (const char*)p);
}

void Write(void* p) {
    printf(">> ");
    char text[128];
    gets_s(text);
    strcpy_s((char*)p, _countof(text), text);
}
```

Explanation:

1. **CreateBoundaryDescriptor:**  
A boundary descriptor named "MyDescriptor" is created, which is used to define the namespace boundary.

2. **CreateWellKnownSid:**  
A security identifier (SID) for the built-in users group is created.

3. **AddSIDToBoundaryDescriptor:**  
The created SID is added to the boundary descriptor.

4. **CreatePrivateNamespace / OpenPrivateNamespace:**  
Attempts to create a private namespace with the boundary descriptor. If it already exists, it tries to open it instead.

5. **CreateFileMapping:**  
A file mapping object for shared memory is created with read-write access, with the size of 64KB (1 << 16). This shared memory is created within the private namespace.

6. **MapViewOfFile:**  
The shared memory is mapped to the process's address space, and a pointer to the buffer is obtained.


This program is an example of using private namespaces to control access to shared resources, such as shared memory, making them available only to processes that have the required privileges based on the SID.

[![image.png](https://i.postimg.cc/JnZ0z1mp/image.png)](https://postimg.cc/k6MqjP2S)


We cannot see the fullname in user mode

No way we can get it unless we have kernel access

> ## Handle Inheritance

Handle inheritance in Windows allows a process to pass on its handles to a newly spawned process. 
- To make a handle inheritable, it must be explicitly marked as such. When creating a new process with the **CreateProcess** function, you must set the inherit handles parameter to TRUE for the handles to be inherited.
- The new process receives a duplicate of all inheritable handles that have the exact same values as in the original process. The question then arises on how exactly these handle values are transferred to the new process.

> **Example**

```cpp
#include <Windows.h>
#include <stdio.h>

int main() {
    HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);
    printf("HANDLE: 0x%p\n", hEvent);

    PROCESS_INFORMATION pi;
    STARTUPINFO si = { sizeof(si) };
    WCHAR name[] = L"Notepad";

    ::SetHandleInformation(hEvent, HANDLE_FLAG_INHERIT, HANDLE_FLAG_INHERIT);

    if (::CreateProcess(nullptr, name, nullptr, nullptr, TRUE, 0, nullptr, nullptr, &si, &pi)) {
        printf("PID: %lu\n", pi.dwProcessId);
        ::CloseHandle(pi.hProcess);
        ::CloseHandle(pi.hThread);
    }

    return 0;
}
```

Explanation:

1. **_HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);_**:
 Creates a manual-reset event object. The event is initially non-signaled (FALSE).

2. **_printf("HANDLE: 0x%p\n", hEvent);_**: 
Prints the handle value of the event to the console.


3. **_PROCESS_INFORMATION pi;_**: Declares a PROCESS_INFORMATION structure to receive information about the new process.

4. **_STARTUPINFO si = { sizeof(si) };_**: Initializes a STARTUPINFO structure, which is used in the CreateProcess function to specify the main window properties if the new process creates a window.

5. **_WCHAR name[] = L"Notepad";_**: Declares and initializes a wide character array with the name of the program to be executed ("Notepad").

6. **_::SetHandleInformation(hEvent, HANDLE_FLAG_INHERIT, HANDLE_FLAG_INHERIT);_**: Modifies the event handle so it can be inherited by child processes.

7. **_if (::CreateProcess(nullptr, name, nullptr, nullptr, TRUE, 0, nullptr, nullptr, &si, &pi)) {_**: Attempts to create a new process (Notepad). The TRUE parameter allows the new process to inherit handles.

8. **_printf("PID: %lu\n", pi.dwProcessId);_**: If CreateProcess is successful, prints the process identifier (PID) of the newly created process.

9. **_::CloseHandle(pi.hProcess);_**: Closes the handle to the new process.

10. **_::CloseHandle(pi.hThread);_**: Closes the handle to the primary thread of the new process.

11. **_return 0;_**: The program returns 0, indicating successful execution.

> ## **Handle Duplication**

Handle duplication is a broadly applicable method for sharing resources among processes. 

It is compatible with various types of objects and utilizes the DuplicateHandle API, which is straightforward in operation. 

The main challenge associated with this method is communicating the existence of the duplicate handle to the process that is intended to use it.

```cpp
#include <Windows.h>
#include <stdio.h>
#include <string>

int main() {
    HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);
    printf("HANDLE: 0x%p\n", hEvent);

    HANDLE hProcess = ::OpenProcess(PROCESS_DUP_HANDLE, FALSE, 34264);
    if (!hProcess) {
        printf("Error opening process (%u)\n", ::GetLastError());
        return 1;
    }

    HANDLE hTarget;
    if (::DuplicateHandle(::GetCurrentProcess(), hEvent, hProcess, &hTarget, 0, FALSE, DUPLICATE_SAME_ACCESS)) {
        printf("Success!\n");
    }

    return 0;
}
```
> ## User and GDI Objects

- GDI Graphic device Interface & User objects

  - The **Executive's Object Manager** handles only kernel objects.
  - Management of User and GDI objects falls under **Win32k.sys**.
  - API functions housed in **user32.dll**** and **gdi32.dll** don't use NtDll.dll.
  - These functions directly utilize the sysenter or syscall instructions.
  - User objects include elements like **windows** (identified by HWND), menus (HMENU), and **hooks** (HHOOK).
  - Handles to user objects do not employ reference or handle counting and are exclusive to their Window Station.
  - GDI objects comprise graphical elements such as the device context **(HDC)**, pen **(HPEN)**, brush **(HBRUSH)**, and bitmap **(HBITMAP)**, among others.
  - Handles for GDI objects are also not reference or handle counted and are exclusive to the process that created them.
  - There is no officially documented method for sharing GDI object handles between processes.

[![image.png](https://i.postimg.cc/rz6D9KjX/image.png)](https://postimg.cc/LgT494GN)

  - If a process operates without a user interface, it won't utilize objects such as windows, menus, or graphical elements.
  - Neglecting to properly close these objects can result in leaks. GDI objects are particularly vulnerable since there is a system-wide limit, which is approximately 64,000.
  - Unlike GDI objects, user objects don’t have a similar strict limitation.




























