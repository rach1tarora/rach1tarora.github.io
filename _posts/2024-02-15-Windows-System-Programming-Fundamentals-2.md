---
layout: post
title:  "Windows System Programming: Fundamentals II"
date:   2024-02-15  07:29:20 +0700
tags: [windows]
categories: jekyll update
usemathjax: true
---


Continuation of the windows blog series.
I have posted the part one about [windows internals theory](https://arorarachit.com/blog/windows-system-programming-fundamentals)

### Contents

- [Objects and handles](#objects-and-handles)
- [Handles Usage](#handles-usage)
- [Pseudo Handles](#pseudo-handles)
- [Sharing Objects](#sharing-objects)
- [Objects Names and Sessions](#objects-names-and-sessions)
- [Handle Inheritance](#handle-inheritance)
- [User and GDI Objects](#user-and-gdi-objects)


## Objects and handles

Windows processes manage and reference system resources through handles. Each process possesses a distinct handle table, and upon creation or opening of an object, a handle is allocated which acts as an indirect reference to the object, facilitating the sharing of objects amongst processes. There are tools for observing process handles, such as Process Explorer, handle.exe available from Sysinternals, Resource Monitor which displays named objects, and System Explorer which can be found on GitHub.

- Windows is designed as an object-oriented system, where everything is represented as objects, such as processes, threads, and files.
- The kernel, which is the core part of the operating system, manages these objects and makes them available to the system.
- The objects are stored in a protected area known as system space, which is not directly accessible from the user space (the area where normal applications run).
- These kernel objects have a system of reference counting, which means the system keeps track of how many references or handles are linked to each object to manage their lifecycle.
- Code that runs in kernel mode has the privilege to directly access these objects, unlike user mode processes which interact with the objects indirectly through handles. Handles are like references or pointers provided to user mode processes that allow them to use these objects in a controlled manner.


![https://media.discordapp.net/attachments/791571025368186890/1208889540408901642/image.png?ex=65e4ed1e&is=65d2781e&hm=a5a25748499025106686d00eeb27cf846b3fd9d2f76bf0c9c0d9e5f431e1334a&=&format=webp&quality=lossless&width=1057&height=313](https://media.discordapp.net/attachments/791571025368186890/1208889540408901642/image.png?ex=65e4ed1e&is=65d2781e&hm=a5a25748499025106686d00eeb27cf846b3fd9d2f76bf0c9c0d9e5f431e1334a&=&format=webp&quality=lossless&width=1057&height=313)

The value assigned to a handle is always a multiple of four, and zero is not considered a valid value for a handle. To view more details about an item, one should perform a double-click action and then select 'Properties'.

![https://media.discordapp.net/attachments/791571025368186890/1208890729850478592/image.png?ex=65e4ee3a&is=65d2793a&hm=29b94c3eef0e95c8963fec8a0f3b0cfeb83cc9da050d5c0f09f98357c6cde573&=&format=webp&quality=lossless&width=571&height=525](https://media.discordapp.net/attachments/791571025368186890/1208890729850478592/image.png?ex=65e4ee3a&is=65d2793a&hm=29b94c3eef0e95c8963fec8a0f3b0cfeb83cc9da050d5c0f09f98357c6cde573&=&format=webp&quality=lossless&width=571&height=525)


The access mask indicates the permissions or types of operations that are permitted through a particular handle. Each handle grants a specific level of access to a resource or object.




> **Showing Unnamed handles and Mappings**

![https://media.discordapp.net/attachments/791571025368186890/1208892505014280252/image.png?ex=65e4efe1&is=65d27ae1&hm=6543ccadd3bd8cdb51da861758d309f9d19fecfb92bb0b75a2bcc52ad07ac663&=&format=webp&quality=lossless&width=1000&height=483](https://media.discordapp.net/attachments/791571025368186890/1208892505014280252/image.png?ex=65e4efe1&is=65d27ae1&hm=6543ccadd3bd8cdb51da861758d309f9d19fecfb92bb0b75a2bcc52ad07ac663&=&format=webp&quality=lossless&width=1000&height=483)


Now, Unnamed handles are visible

![https://media.discordapp.net/attachments/791571025368186890/1208892888826642482/image.png?ex=65e4f03c&is=65d27b3c&hm=d94f71f5f10a237745fba62b46c57bb5285b12e7d6fe410035fa0ecd114989d0&=&format=webp&quality=lossless&width=538&height=525](https://media.discordapp.net/attachments/791571025368186890/1208892888826642482/image.png?ex=65e4f03c&is=65d27b3c&hm=d94f71f5f10a237745fba62b46c57bb5285b12e7d6fe410035fa0ecd114989d0&=&format=webp&quality=lossless&width=538&height=525)



The kernel have direct pointers to the object, bypassing the need for handles, which are only necessary in user mode. 




An object having more handles implies it is being accessed by multiple users or processes. 


![https://media.discordapp.net/attachments/791571025368186890/1208894155279831100/image.png?ex=65e4f16a&is=65d27c6a&hm=ed0e5f07f9698c8f217359ef314b11d8fabb61735e5cf87b77a30915434b4114&=&format=webp&quality=lossless&width=595&height=525](https://media.discordapp.net/attachments/791571025368186890/1208894155279831100/image.png?ex=65e4f16a&is=65d27c6a&hm=ed0e5f07f9698c8f217359ef314b11d8fabb61735e5cf87b77a30915434b4114&=&format=webp&quality=lossless&width=595&height=525)



Certain objects are exclusively accessible and utilized by the kernel, not available to user mode.

![https://media.discordapp.net/attachments/791571025368186890/1208894227560276048/image.png?ex=65e4f17c&is=65d27c7c&hm=92d7a1b2c6bba2ffd248049cd79160912088cdadca2f8a82bc4fc5dda40c43c9&=&format=webp&quality=lossless&width=1057&height=196](https://media.discordapp.net/attachments/791571025368186890/1208894227560276048/image.png?ex=65e4f17c&is=65d27c7c&hm=92d7a1b2c6bba2ffd248049cd79160912088cdadca2f8a82bc4fc5dda40c43c9&=&format=webp&quality=lossless&width=1057&height=196)


> **Objects which are exposed by Windows API**

- Process (CreateProcess, OpenProcess)
- Thread (CreateThread, OpenThread)
- Job (CreateJobObject, OpenJobObject)
- File (CreateFile, CreateFile2)
- File mapping (Section) (CreateFileMapping, OpenFileMapping)
- Token (LogonUser, OpenProcessToken)
- Mutex (Mutant) (CreateMutex(Ex), OpenMutex)
- Event (CreateEvent(Ex), OpenEvent)
- Semaphore (CreateSemaphore, OpenSemaphore)
- Timer (CreateWaitableTimer, OpenWaitableTimer)
- I/O Completion Port (CreateIoCompletionPort)
- Window Station (CreateWindowStation, OpenWindowStation)
- Desktop (CreateDesktop, OpenDesktop)

## Handles Usage

- User mode processes obtain a handle by using a Create* function or an Open* function.
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



- **HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);**: This line declares a handle to an event object and attempts to create the event using CreateEvent. The parameters are as follows:

- **nullptr** for the security attributes, indicating default security.
- **TRUE** to indicate that the event is manual-reset, meaning the SetEvent function must be called to return the event object to the nonsignaled state.
- **FALSE** to indicate the initial state of the event object is nonsignaled.
- **nullptr** for the name of the event, indicating it is unnamed


- **::SetEvent(hEvent);**: This function sets the event object to the signaled state. Any threads waiting for the event would be released if the event were being waited on.

- **::CloseHandle(hEvent);**: This function closes the handle to the event object. When no more handles to the event object exist, the system can free the event object's resources.

**Key Takeaways From example1**

- Initiate debugging by pressing F12 to place a breakpoint and set the project as the startup project.
- Begin execution, and when the breakpoint at the main function is hit, step through each line to monitor the behavior.
- Search for the AC handle to examine its properties.


![https://media.discordapp.net/attachments/791571025368186890/1208913304827727912/image.png?ex=65e50340&is=65d28e40&hm=56b8c4712afdfb7036f15790ddd57d8416c31bb25d2710a2241bb19a3a153cd4&=&format=webp&quality=lossless&width=1074&height=177](https://media.discordapp.net/attachments/791571025368186890/1208913304827727912/image.png?ex=65e50340&is=65d28e40&hm=56b8c4712afdfb7036f15790ddd57d8416c31bb25d2710a2241bb19a3a153cd4&=&format=webp&quality=lossless&width=1074&height=177)

- Identify the event type as "notification," indicating it's a manual-reset event.
- Note that the initial state of "signalled false" means the event starts as nonsignaled.

![https://media.discordapp.net/attachments/791571025368186890/1208911619426492527/image.png?ex=65e501ae&is=65d28cae&hm=7ab4e489257fc3ba72d8f6731f4cf5a54815fc29aabc1e57be8d38ab438e2a82&=&format=webp&quality=lossless&width=598&height=583](https://media.discordapp.net/attachments/791571025368186890/1208911619426492527/image.png?ex=65e501ae&is=65d28cae&hm=7ab4e489257fc3ba72d8f6731f4cf5a54815fc29aabc1e57be8d38ab438e2a82&=&format=webp&quality=lossless&width=598&height=583)

- Execute the **SetEvent** function to change the event's state.
- Observe the transition to "signalled true," which confirms the event's state has been altered.

![https://media.discordapp.net/attachments/791571025368186890/1208913046345486407/image.png?ex=65e50302&is=65d28e02&hm=bb81d3e2c6cd9e026afb440a7e720e3813ebf783cf96fc18a7049948e493324d&=&format=webp&quality=lossless&width=657&height=619](https://media.discordapp.net/attachments/791571025368186890/1208913046345486407/image.png?ex=65e50302&is=65d28e02&hm=bb81d3e2c6cd9e026afb440a7e720e3813ebf783cf96fc18a7049948e493324d&=&format=webp&quality=lossless&width=657&height=619)

- Upon closing the handle, the associated visual indicator will turn red and disappear, indicating the handle is no longer valid.

![https://cdn.discordapp.com/attachments/791571025368186890/1208913253133066311/image.png?ex=65e50334&is=65d28e34&hm=5128cb042d2844777e24426e22ee50b7b05bc9c180ba4ba07cb2be4a47ec78fa&](https://cdn.discordapp.com/attachments/791571025368186890/1208913253133066311/image.png?ex=65e50334&is=65d28e34&hm=5128cb042d2844777e24426e22ee50b7b05bc9c180ba4ba07cb2be4a47ec78fa&)

- Any subsequent attempt to reference the event handle will result in an "invalid handle" error because the handle has been closed.

## Pseudo Handles


- Regular valid handles in Windows are multiples of four, with the first valid handle value being 4.
- Pseudo handles are assigned specific values and cannot be closed like normal handles. These include:
  - **GetCurrentProcess** with a value of -1, representing the current process.
  - **GetCurrentThread** with a value of -2, representing the current thread.
- For Windows 8 and newer versions, there are additional pseudo handles:
  - **GetCurrentProcessToken** with a value of -4, for the token of the current process.
  - **GetCurrentThreadToken** with a value of -5, for the token of the current thread.
  - **GetCurrentThreadEffectiveToken** with a value of -6, for the token of the current thread if it is impersonating; if not, it represents the token of the process.
- All tokens are accessible with **TOKEN_QUERY** and **TOKEN_QUERY_SOURCE** permissions only.


```cpp
::SetPriorityClass(::GetCurrentProcess(), HIGH_PRIORITY_CLASS);
```


- Typically, processes in Windows operate at a normal priority level.
- The **GetCurrentProcess** function retrieves a pseudo handle to the currently running process.
- Instead of the more complex operations done previously, we can set a breakpoint and execute this line to increase the process's priority level.
- By executing this code, we can observe whether our process's priority is set to high.
- This demonstrates that using pseudo handles is straightforward and avoids complexity.


## Sharing Objects


- Handles are specific to the process that created them
- There are occasions where objects must be accessible across different processes
- Objects can be shared using various methods:
  - Through inheriting handles when a new child process is spawned by a parent process
  - By accessing an object using its name, which is the easiest method
  - By creating a duplicate of a handle, which is a more universal approach but can be more complex to implement in practice


  > **Understanding the wmplayer example**

When we launch Windows Media Player (wmplayer), it creates a named object (likely a mutex) to check for an existing instance of itself. If another instance of the player is already running, the application detects the existing named object and does not start a new instance, preventing multiple instances from running simultaneously.

This mechanism involves creating a named synchronization object, such as a mutex, which acts as a signal for the application to recognize an active instance. If the application tries to create a mutex that already exists, it knows another process is running and will typically close or not start a new process.

![https://media.discordapp.net/attachments/791571025368186890/1208920340898644028/image.png?ex=65e509cd&is=65d294cd&hm=3889d05c41e599e87fc7cecce462a080584bedc35f7a6a76f58f0c6670be03c4&=&format=webp&quality=lossless&width=1074&height=55](https://media.discordapp.net/attachments/791571025368186890/1208920340898644028/image.png?ex=65e509cd&is=65d294cd&hm=3889d05c41e599e87fc7cecce462a080584bedc35f7a6a76f58f0c6670be03c4&=&format=webp&quality=lossless&width=1074&height=55)

Using tools like Process Explorer, which utilize kernel drivers, you can close handles directly. This bypasses the need for the application's **CloseHandle** function. After closing the handle to the named object, if you try to run Windows Media Player again, it will start because it no longer detects an active instance signaled by the named object.

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

- **HANDLE hMutex = ::CreateMutex(nullptr, FALSE, L"MySingleInstanceMutex");**  
This line attempts to create a mutex named "MySingleInstanceMutex". If the mutex already exists, the function will return a handle to the existing mutex instead of creating a new one.

- **if (::GetLastError() == ERROR_ALREADY_EXISTS) {**  
The program checks if the last error code is ERROR_ALREADY_EXISTS, which means the mutex was already created by another instance of the program.


- **char dummy[4];**  
**gets_s(dummy);**  
These lines declare a buffer and then use gets_s to wait for user input. This is a simple way to keep the program running so you can observe its behavior.

- **::CloseHandle(hMutex);**  
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

1. **HANDLE hMemMap**: This declares a handle to a file mapping object. It is initialized by the CreateFileMapping function.
   
2. **INVALID_HANDLE_VALUE**: This is a constant indicating that the file mapping object is not backed by any existing file on disk.

3. **PAGE_READWRITE**: This constant specifies the protection for the file mapping object, allowing both reading and writing to the memory.

4. **void* p**: This declares a void pointer p which will hold the starting address of the mapped view of the file.

5. **CreateFileMapping**: This function creates or opens a named or unnamed file mapping object for a specified file.

6. **MapViewOfFile**: This function maps a view of a file mapping into the address space of the calling process.

7. **FILE_MAP_READ FILE_MAP_WRITE**: This constant specifies the type of access to the file mapping object, allowing both reading and writing to the memory.

![https://media.discordapp.net/attachments/791571025368186890/1209002600792330260/image.png?ex=65e5566a&is=65d2e16a&hm=18efe3c3c7700621aeddcc521a58e5a6855f73fe18506e26555199723d480982&=&format=webp&quality=lossless&width=1048&height=531](https://media.discordapp.net/attachments/791571025368186890/1209002600792330260/image.png?ex=65e5566a&is=65d2e16a&hm=18efe3c3c7700621aeddcc521a58e5a6855f73fe18506e26555199723d480982&=&format=webp&quality=lossless&width=1048&height=531)

![https://media.discordapp.net/attachments/791571025368186890/1209002742597550110/image.png?ex=65e5568c&is=65d2e18c&hm=c2e060beb78ea6b3aebe1f6c5e190b6620b09f29dfb404a4900a2a254af85ce6&=&format=webp&quality=lossless&width=595&height=408](https://media.discordapp.net/attachments/791571025368186890/1209002742597550110/image.png?ex=65e5568c&is=65d2e18c&hm=c2e060beb78ea6b3aebe1f6c5e190b6620b09f29dfb404a4900a2a254af85ce6&=&format=webp&quality=lossless&width=595&height=408)


## Objects Names and Sessions


In terminal server environments, each session is isolated and has its own set of objects. 

The object manager organizes these by creating a specific directory for each session identified by its session ID. Within these directories, named objects relevant to each session are created, with the naming being automatically prefixed to ensure session-specific access. 

Additionally, objects from session zero, which is the default session, can be accessed by other sessions by using the prefix "Global\" when naming objects to obtain handles.


There must be a way to hide these objects because they are visible anywhere


The term "BaseNamedObjects" refers to the collection of all named objects that are active in your current session. These objects are distinct because they have been given specific names.

Session 0 is unique and serves as the primary session in which system services and other critical processes run. The named objects within Session 0 are housed in the BaseNamedObjects directory, located at the root ("/") directory.

Objects that reside in Session 0 can be made accessible to other sessions, allowing for the sharing of resources across different user sessions.

> **Private Object Namespaces**


Standard object names in Windows are public and can be easily identified and located with various tools or through code. 

However, starting with Windows Vista, the operating system introduced the concept of private object namespaces which are not visible publicly. 

- These private namespaces enhance security by allowing further restrictions based on Security Identifiers (SIDs) or the integrity level of processes.
  - To manage these private namespaces, Windows provides specific Application Programming Interfaces (APIs) such as CreateBoundaryDescriptor, AddSIDToBoundaryDescriptor, CreatePrivateNamespace, OpenPrivateNamespace, and ClosePrivateNamespace.

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


- **CreateBoundaryDescriptor:**  
A boundary descriptor named "MyDescriptor" is created, which is used to define the namespace boundary.

- **CreateWellKnownSid:**  
A security identifier (SID) for the built-in users group is created.

- **AddSIDToBoundaryDescriptor:**  
The created SID is added to the boundary descriptor.

- **CreatePrivateNamespace / OpenPrivateNamespace:**  
Attempts to create a private namespace with the boundary descriptor. If it already exists, it tries to open it instead.

- **CreateFileMapping:**  
A file mapping object for shared memory is created with read-write access, with the size of 64KB (1 << 16). This shared memory is created within the private namespace.

- **MapViewOfFile:**  
The shared memory is mapped to the process's address space, and a pointer to the buffer is obtained.


This program is an example of using private namespaces to control access to shared resources, such as shared memory, making them available only to processes that have the required privileges based on the SID.

![https://media.discordapp.net/attachments/791571025368186890/1209004750507348018/image.png?ex=65e5586a&is=65d2e36a&hm=7188af84c5c1839f44e34dbb9df4d007b4a120bf266f5f9b036ddcbf22cf09b4&=&format=webp&quality=lossless&width=1057&height=157](https://media.discordapp.net/attachments/791571025368186890/1209004750507348018/image.png?ex=65e5586a&is=65d2e36a&hm=7188af84c5c1839f44e34dbb9df4d007b4a120bf266f5f9b036ddcbf22cf09b4&=&format=webp&quality=lossless&width=1057&height=157)

![https://media.discordapp.net/attachments/791571025368186890/1209004825384329257/image.png?ex=65e5587c&is=65d2e37c&hm=8d15208baf8c6bd1440a72252efd3e289264029610f724ac0c732339c0a6b1db&=&format=webp&quality=lossless&width=1057&height=19](https://media.discordapp.net/attachments/791571025368186890/1209004825384329257/image.png?ex=65e5587c&is=65d2e37c&hm=8d15208baf8c6bd1440a72252efd3e289264029610f724ac0c732339c0a6b1db&=&format=webp&quality=lossless&width=1057&height=19)

We cannot see the fullname in user mode

No way we can get it unless we have kernel access

## Handle Inheritance

Handle inheritance in Windows allows a process to pass on its handles to a newly spawned process. 
-To make a handle inheritable, it must be explicitly marked as such. When creating a new process with the **CreateProcess** function, you must set the inherit handles parameter to TRUE for the handles to be inherited.
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

1. **HANDLE hEvent = ::CreateEvent(nullptr, TRUE, FALSE, nullptr);**
   - Creates a manual-reset event object. The event is initially non-signaled (FALSE).

2. **printf("HANDLE: 0x%p\n", hEvent);**
   - Prints the handle value of the event to the console.

3. **PROCESS_INFORMATION pi;**
   - Declares a PROCESS_INFORMATION structure to receive information about the new process.

4. **STARTUPINFO si = { sizeof(si) };**
   - Initializes a STARTUPINFO structure, which is used in the CreateProcess function to specify the main window properties if the new process creates a window.

5. **WCHAR name[] = L"Notepad";**
   - Declares and initializes a wide character array with the name of the program to be executed ("Notepad").

6. **::SetHandleInformation(hEvent, HANDLE_FLAG_INHERIT, HANDLE_FLAG_INHERIT);**
   - Modifies the event handle so it can be inherited by child processes.

7. **if (::CreateProcess(nullptr, name, nullptr, nullptr, TRUE, 0, nullptr, nullptr, &si, &pi)) {**
   - Attempts to create a new process (Notepad). The TRUE parameter allows the new process to inherit handles.

8. **printf("PID: %lu\n", pi.dwProcessId);**
   - If CreateProcess is successful, prints the process identifier (PID) of the newly created process.

9. **::CloseHandle(pi.hProcess);**
   - Closes the handle to the new process.

10. **::CloseHandle(pi.hThread);**
    - Closes the handle to the primary thread of the new process.

11. **return 0;**
    - The program returns 0, indicating successful execution.

> **Handle Duplication**

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
## User and GDI Objects

GDI Graphic device Interface & User objects


- The Executive's Object Manager handles only kernel objects.
- Management of User and GDI objects falls under Win32k.sys.
- API functions housed in user32.dll and gdi32.dll dont use NtDll.dll.
- These functions directly utilize the sysenter or syscall instructions.

- User objects include elements like windows (identified by HWND), menus (HMENU), and hooks (HHOOK).
- Handles to user objects do not employ reference or handle counting and are exclusive to their Window Station.
- GDI objects comprise graphical elements such as the device context (HDC), pen (HPEN), brush (HBRUSH), and bitmap (HBITMAP), among others.
- Handles for GDI objects are also not reference or handle counted and are exclusive to the process that created them.
- There is no officially documented method for sharing GDI object handles between processes.

![https://media.discordapp.net/attachments/791571025368186890/1209013420192567357/image.png?ex=65e5607d&is=65d2eb7d&hm=e44a4f916ad676328be5fe065ba28638212d0fda4d6b24222f5efa43b85f46ac&=&format=webp&quality=lossless&width=201&height=241](https://media.discordapp.net/attachments/791571025368186890/1209013420192567357/image.png?ex=65e5607d&is=65d2eb7d&hm=e44a4f916ad676328be5fe065ba28638212d0fda4d6b24222f5efa43b85f46ac&=&format=webp&quality=lossless&width=201&height=241)

- If a process operates without a user interface, it won't utilize objects such as windows, menus, or graphical elements.
- Neglecting to properly close these objects can result in leaks. GDI objects are particularly vulnerable since there is a system-wide limit, which is approximately 64,000.
- Unlike GDI objects, user objects don’t have a similar strict limitation.