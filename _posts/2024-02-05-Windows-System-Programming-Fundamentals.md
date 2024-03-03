---
layout: post
title:  "Windows System Programming: Fundamentals I"
date:   2024-02-11s 07:29:20 +0700
tags: [windows]
categories: jekyll update
usemathjax: true
---
Continuation of the windows blog series.
I have posted the part one about [windows internals theory](https://arorarachit.com/blog/windows-internals-theory)

### Contents

- [Building a basic application in windows](#building-a-basic-application-in-windows)
- [Error](#error)
- [32 vs 64 bit](#32-and-64-bit)
- [Strings](#strings)
- [Structures](#structures)
- [WOW64](#wow64)
- [Win32API](#win32api)
- [Numeric Versions](#numeric-versions)

## Windows Application Development

Windows application development involves using the Windows API and using Visual Studio the free community edition and "Desktop development with C++" workload , alongside Sysinternals and other auxiliary tools.

### Building a basic application in windows

> Understanding a basic program:

```cpp
#include <Windows.h>
#include <stdio.h>

int main() {
    SYSTEM_INFO si;
    ::GetNativeSystemInfo(&si);

    printf("Number of Logical Processors: %lu\n", si.dwNumberOfProcessors);
    printf("Page size: %u Bytes\n", si.dwPageSize);
    printf("Processor Mask: %#zx\n", si.dwActiveProcessorMask);
    printf("Minimum process address: %#p\n", si.lpMinimumApplicationAddress);
    printf("Maximum process address: %#p\n", si.lpMaximumApplicationAddress);

    return 0;
}
```



**SYSTEM_INFO si;**: This line declares a variable si of type SYSTEM_INFO, which is a structure provided by the Windows API. This structure contains information about the current system.

**::GetNativeSystemInfo(&si);**: This line calls the GetNativeSystemInfo function provided by the Windows API to retrieve information about the system and stores it in the si variable. The &si passes the address of the si variable to the function so that it can populate the structure with system information.


### Error

When working with Windows API functions, it's important to note that a return value of FALSE (0) indicates failure, and GetLastError can be used to retrieve the error code, which can then be translated into a textual description using tools like Error Lookup or FormatMessage.

Creating a error function:

```cpp
int Error(const char* msg) {
    printf("%s (%u)\n", msg, ::GetLastError());
    return 1;
}
```

Common return types for error handling include HANDLE, LRESULT, and HRESULT. 

A HANDLE value of NULL or INVALID_HANDLE_VALUE indicates a failure, prompting a GetLastError call. 

An LRESULT or LONG returning ERROR_SUCCESS signifies success.

For COM methods, an HRESULT of S_OK represents success, while negative values denote errors.

### 32 and 64 bit

The majority of Windows systems now use 64-bit architecture. On these systems, 32-bit applications function through the "Windows on Windows 64" (Wow64) compatibility layer, which allows them a 4 GB address space, double the traditional 2 GB limit. While Windows APIs remain largely the same in structure, adaptations have been made to accommodate 64-bit data types, particularly for pointers and handles, and new data types have been introduced that vary in size based on the system's architecture.


If we want 4gb of addr space instead of 2 on a 64 bit system, go to project properties.

[![image.png](https://i.postimg.cc/0Qrj42sj/image.png)](https://postimg.cc/xJD9JQqV)

### Strings

In Windows development, strings are encoded using UTF-16, which allocates two bytes per character. Often referred to simply as Unicode, this format is also employed by the Windows API. To maintain compatibility, ANSI (ASCII) versions of functions are available; these convert ANSI strings to Unicode before proceeding. API functions typically come in pairs, with names ending in 'W' for Unicode and 'A' for ANSI versions, and these names are usually macros.

we must distinguish between the use of ASCII and Unicode (which
Microsoft sometimes refers to as UTF-16). Since ASCII characters use one byte and Unicode uses at least two, many of the Win32 APIs are available in two distinct versions

```cpp
BOOL GetUserNameA(
  [out]     LPSTR   lpBuffer,
  [in, out] LPDWORD pcbBuffer
);
```

the prototype for GetUserNameA, where the suffix “A” indicates the ASCII version of the API. the prototype for GetUserNameW, in which the “W” suffix (for “wide char”) indicates Unicode:

We always have to work with unicode whenever working with windows API. 


- Traditional C string manipulation functions like strcpy and strcat are deemed unsafe.
- Secure alternatives such as strcpy_s and wcscat_s are recommended.
- Additional secure functions can be found in strsafe.h, including StringCchCopy, StringCchCat, and StringCchPrintf.
- These functions are available in both ASCII (A) and Unicode (W) versions.

> Working with these functions down below

```cpp
#include <Windows.h>
#include <stdio.h>

int Error(const char* msg) {
    printf("%s (%u)\n", msg, ::GetLastError());
    return 1;
}

int main() {
    SYSTEM_INFO si;
    ::GetNativeSystemInfo(&si);

    printf("Processors: %u\n", si.dwNumberOfProcessors);
    printf("Page Size: %u bytes\n", si.dwPageSize);
    printf("Processor mask: 0x%zx\n", si.dwActiveProcessorMask);

    ::MessageBox(nullptr, L"This is my string", L"Strings Demo", MB_OK | MB_ICONINFORMATION);

    return 0;
}

```

each character in the string is represented by a wide character (typically 16 bits or more), as opposed to a regular narrow character string where each character is usually 8 bits.

```
::MessageBox(nullptr, L"This is string 1", L"String 2", MB_OK | MB_ICONINFORMATION);
```

The **L** before the string literals "This is string 1" and "String 2" indicates that these are wide character strings. This is important when working with Windows API functions like MessageBox because some Windows functions have both narrow and wide character versions. The L prefix ensures that the compiler interprets the string as a wide character string, matching the expected format for functions like MessageBoxW (where the 'W' stands for wide character).

Which means each character in the string is represented by a wide character (typically 16 bits or more), as opposed to a regular narrow character string where each character is usually 8 bits.

If we remove the L there would be compile error, for that to work we need to explicitly convert it to ASCII.


> **Example 2** 

[![image.png](https://i.postimg.cc/KckDWtxP/image.png)](https://postimg.cc/NLtX99yF)

**WCHAR buffer[128];**: This line declares a wide character array named **buffer** with a size of 128 elements. The type **WCHAR** represents a wide character, typically used for Unicode characters.

```
::StringCchPrintf(buffer, _countof(buffer), L"This is my string from process %u", ::GetCurrentProcessId());
```
Here, the **StringCchPrintf** function is used to format a string and store it in the **buffer**. This function is a safer version of **sprintf** that helps prevent buffer overflows. The format specifier **%u** is used to represent an unsigned integer. The formatted string includes the text "This is my string from process" followed by the current process ID obtained using **GetCurrentProcessId()**.

```
::MessageBox(nullptr, buffer, L"string 1", MB_OK | MB_ICONINFORMATION);
```
This line displays a message box using the **MessageBox** function. The parameters are as follows:
- **nullptr**: The handle to the owner window (in this case, no owner window is specified).
- **buffer**: The text to be displayed in the message box, which contains the formatted string from the previous line.
- **L"string 1"**: The title or caption of the message box.
- **MB_OK  MB_ICONINFORMATION**: Flags specifying the buttons and icon to be displayed in the message box. In this case, it has an "OK" button and an information icon.


> **Using GetSystemDirectory Function**


```cpp
#include <Windows.h>
#include <stdio.h>
#include <strsafe.h>


int Error(const char* msg) {
    printf("%s (%u)\n", msg, ::GetLastError());
    return 1;
}

int main() {
    SYSTEM_INFO si;
    ::GetNativeSystemInfo(&si);

    printf("Processors: %lu\n", si.dwNumberOfProcessors);
    printf("Page Size: %u bytes\n", si.dwPageSize);
    printf("Processor mask: 0x%zx\n", si.dwActiveProcessorMask);

    WCHAR buffer[128];
    ::StringCchPrintf(buffer, _countof(buffer), L"This is my string from process %lu", ::GetCurrentProcessId());

    WCHAR path[MAX_PATH];
    ::GetSystemDirectory(path, _countof(path));
    printf("System directory: %ws\n", path);

    WCHAR computerName[MAX_COMPUTERNAME_LENGTH];
    DWORD len = _countof(computerName);
    if (::GetComputerName(computerName, &len)) {
        printf("Computer name: %ws (%u)\n", computerName, len);
    }


    return 0;
}


```

[![image.png](https://i.postimg.cc/bNQy3V5K/image.png)](https://postimg.cc/N5jv0DB4)

You can always press f1 on a structure to get more information through MSDN.

For example,
```cpp

typedef struct _SYSTEM_INFO {
  union {
    DWORD dwOemId;
    struct {
      WORD wProcessorArchitecture;
      WORD wReserved;
    } DUMMYSTRUCTNAME;
  } DUMMYUNIONNAME;
  DWORD     dwPageSize;
  LPVOID    lpMinimumApplicationAddress;
  LPVOID    lpMaximumApplicationAddress;
  DWORD_PTR dwActiveProcessorMask;
  DWORD     dwNumberOfProcessors;
  DWORD     dwProcessorType;
  DWORD     dwAllocationGranularity;
  WORD      wProcessorLevel;
  WORD      wProcessorRevision;
} SYSTEM_INFO, *LPSYSTEM_INFO;
```

### Structures


In C/C++ programming for Windows, structures are typically defined using a pattern that includes the structure declaration and a pointer to it. The "L" prefix for pointers, denoting 'long', is used for historical reasons to ensure compatibility. Pointers are universally the same size across the application, either 4 bytes on 32-bit systems or 8 bytes on 64-bit systems. Additionally, structures can be made version-aware by including their size as the first element.


```c
typedef struct _SOME_STRUCT {
    // members...
} SOME_STRUCT, *PSOME_STRUCT;
```

**Zeroing out a structure**


```c
SHELLEXECUTEINFO sei = { sizeof(sei) };

// memset(&sei, 0, sizeof(sei));
// sei.cbSize = sizeof(sei);
```

This code initializes a SHELLEXECUTEINFO structure and sets its cbSize member to the size of the structure, which is necessary for the structure to be used correctly with Shell API functions. The commented-out lines show alternative ways to achieve the same initialization.

```c
memset(&sei, 0, sizeof(sei));
```

- &sei is the pointer to the structure sei.
- 0 is the value that each byte is to be set to.
- sizeof(sei) specifies the number of bytes to be set to



> **Example code**

```cpp
SHELLEXECUTEINFO sei = { sizeof(sei) };

// memset(&sei, 0, sizeof(sei));
// sei.cbSize = sizeof(sei);

sei.lpFile = L"C:\\windows\\win.ini";
sei.lpVerb = L"open";
sei.nShow = SW_SHOWNORMAL;

::ShellExecuteEx(&sei);
return 0;
```

1. **ELLEXECUTEINFO sei = { sizeof(sei) };**
   - Declares an instance of the SHELLEXECUTEINFO structure named sei.
   - Initializes the structure and sets its size to the size of the structure using sizeof(sei).

2. **sei.lpFile = L"c:\\windows\\win.ini";**
   - Sets the lpFile member of the SHELLEXECUTEINFO structure to the path of the file to be executed. In this case, it's set to "c:\\windows\\win.ini". The L before the string indicates that it's a wide string (Unicode).

3. **sei.lpVerb = L"open";**
   - Sets the lpVerb member of the SHELLEXECUTEINFO structure to the verb to be used when opening the file. In this case, it's set to "open". The verb "open" is a common verb used to open files.

4. **sei.nShow = SW_SHOWNORMAL;**
   - Sets the nShow member of the SHELLEXECUTEINFO structure to determine how the window should be displayed when the application is executed. In this case, it's set to SW_SHOWNORMAL, which typically means the application window is displayed in its most recent size and position.

5. **::ShellExecuteEx(&sei);**
   - Calls the ShellExecuteEx function with a pointer to the SHELLEXECUTEINFO structure as an argument. This function is part of the Windows API and is used to execute a specified file or operation. It takes the information provided in the SHELLEXECUTEINFO structure and performs the corresponding action, such as opening a file with the specified verb.

In summary, this code sets up a structure with information about a file to be executed (in this case, "c:\\windows\\win.ini") and how it should be opened, and then uses the ShellExecuteEx function to perform the execution based on the provided information.

### WOW64

Microsoft introduced the concept of **Windows On Windows 64-bit (WOW64)**which allows a 64-bit version of Windows to execute 32-bit applications with almost no loss of efficiency


WOW64 utilizes four 64-bit libraries (Ntdll.dll, Wow64.dll, Wow64Win.dll and Wow64Cpu.dll) to emulate the execution of 32-bit code and perform translations between the application and the kernel.

On 32-bit versions of Windows, most native Windows applications and libraries are stored in C:\Windows\System32. On 64-bit versions of Windows, 64-bit native programs and DLLs are stored in C:\Windows\System32 and 32-bit versions are stored in C:\Windows\SysWOW64.

### Win32API

- This is a classic C API that dates back to the early days of Windows NT.
- Some of the APIs are COM-based, particularly those introduced in and after the Vista era.
- Examples of such APIs include BITS, DirectX, WIC, and Media Foundation.

**.NET**
- It consists of managed libraries that operate on top of the CLR (Common Language Runtime).
- It supports several programming languages, such as C#, VB.NET, F#, and C++/CLI.

**Windows Runtime (WinRT)**
- WinRT is a newer unmanaged API that became available starting with Windows 8.
- It is constructed atop an enhanced version of COM (Component Object Model).


### Numeric Versions


[![image.png](https://i.postimg.cc/MHGsvpLy/image.png)](https://postimg.cc/dkzRfww1)

- **Classic Method:**
  - Historically, the **GetVersionEx** function was used to determine the version of Windows.
  - This function is now deprecated.

- **New Version Helper APIs:**
  - The current method utilizes version helper APIs, which are included in **<versionhelpers.h>**.
  - Specific functions such as **IsWindowsXPSP3OrGreater**, **IsWindows7OrGreater**, **IsWindows10OrGreater**, **IsWindowsServer**, among others are used.
  - These are implemented alongside the **VerifyVersionInfo** function.

- **Manifest Requirement:**
  - To ensure accurate version detection, a manifest file is necessary.


```cpp

  // WinVersion.cpp: This file contains the 'main' function. Program execution begins and ends there.

#define BUILD_WINDOWS
#include <windows.h>
#include <stdio.h>

int main() {
    OSVERSIONINFO vi = { sizeof(vi) };
    ::GetVersionEx(&vi);

    printf("%lu.%lu.%lu\n", vi.dwMajorVersion, vi.dwMinorVersion, vi.dwBuildNumber);

    return 0;
}

```

To obtain the actual version of the currently running Windows system, you should:

Set the current project as the startup project to ensure the output reflects the system it's executed on.
Add an XML file named "manifest" to your project. This will create an empty XML file.


In a new C# project, add a new item and search for a manifest file template.
[![image.png](https://i.postimg.cc/MprtFwvT/image.png)](https://postimg.cc/TKgrKZjM)


For version detection, you need a specific GUID provided by Microsoft, which is a constant and will not change. This GUID is used in the manifest file to ensure your application can access the correct system information.

[![image.png](https://i.postimg.cc/fWv9ThYR/image.png)](https://postimg.cc/HjVxBRSq)

Navigate to the properties of your project and locate the manifest file.
In the manifest file, find the Windows 10 GUID section and uncomment it to activate it.

[![image.png](https://i.postimg.cc/8c1QpvMw/image.png)](https://postimg.cc/r0YYgKht)

[![image.png](https://i.postimg.cc/HLgCZFnf/image.png)](https://postimg.cc/BjMytYxg)



Microsoft does not always update the version number with new updates or services, making it less straightforward to retrieve the version number. This is by design to encapsulate various updates under the same version umbrella.


Output:

[![image.png](https://i.postimg.cc/8CSm7mXR/image.png)](https://postimg.cc/nX3D5BJr)
