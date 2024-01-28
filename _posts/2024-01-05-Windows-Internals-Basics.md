---
layout: post
title:  "Windows Internals: Basics"
date:   2024-01-12 07:29:20 +0700
tags: [windows]
categories: jekyll update
usemathjax: true
---

Contents

[Link to Example Heading](#Thread)



### Resources

Windows is a vast topic, some resources before I start  
- "Windows Internals 7th edition, Part 1" / Pavel Yosifovich & Alex lonescu 
(2017) 
- "Windows 10 System Programming, Part 1" / Pavel Yosifovich (2020) 
- "Windows 10 System Programming, Part 2" / Pavel Yosifovich (WIP) 
- "Windows System Programming" / Johnson M. Hart / 4th ed. (2015) 
- MSDN documentation 
- Various blogs and web sites 


## Architecture

Line is dividing the user-mode and kernel-mode which are parts of the Windows OS.
The boxes above the line represent user-mode processes, and the components below the line are kernel-mode OS services.

![https://media.discordapp.net/attachments/791571025368186890/1201264836353478707/image.png?ex=65c9300f&is=65b6bb0f&hm=a05e613f016a29871cc0d1bd504c20e01ca80c9c1c0f94a68ff552c89d677672&=&format=webp&quality=lossless&width=1104&height=627](https://media.discordapp.net/attachments/791571025368186890/1201264836353478707/image.png?ex=65c9300f&is=65b6bb0f&hm=a05e613f016a29871cc0d1bd504c20e01ca80c9c1c0f94a68ff552c89d677672&=&format=webp&quality=lossless&width=1104&height=627)

1. **User Processes** - A program/application executed by the user such as Notepad,
Google Chrome or Microsoft Word.
2. **Subsystem DLLs** - DLLs that contain API functions that are called by user processes.
3. **Ntdll.dll** - A system-wide DLL which is the lowest layer available in user mode. This is a special DLL that creates the transition from user mode to kernel mode. This is often referred to as the Native API or NTAPI.
4. **Executive Kernel** - This is what is known as the Windows Kernel and it calls other
drivers and modules available within kernel mode to complete tasks. The Windows
kernel is partially stored in a file called ntoskrnl.exe under "C:\Windows\System32"

### Kernel Mode vs. User Mode

- To prevent user applications to modify critical OS data, Windows uses two processor access modes (even if the processor on which Windows is running supports more than two): **user mode** and **kernel mode**.
- User application code runs in user mode, whereas OS code (such as system services and device drivers) runs in kernel mode.
- Kernel mode refers to a mode of execution in a processor that grants access to all system memory and all CPU instructions. Although each Windows process has its own private memory space, the kernel-mode OS and device driver code **share a single virtual address space**.

Processors may distinguish between these modes using various terms such as code privilege level, ring level, supervisor mode, and application mode. However, regardless of the terminology used, the processor grants the operating system kernel a higher privilege level compared to user mode applications. This differentiation in privilege levels provides a crucial foundation for operating system designers to guarantee that a malfunctioning application cannot compromise the stability of the entire system.

![https://media.discordapp.net/attachments/791571025368186890/1201268962596499516/image.png?ex=65c933e7&is=65b6bee7&hm=b91b9d7f8abed0707a0d5ed4eb743f6342c15c9e9383116920110f0d44a125a7&=&format=webp&quality=lossless&width=918&height=685](https://media.discordapp.net/attachments/791571025368186890/1201268962596499516/image.png?ex=65c933e7&is=65b6bee7&hm=b91b9d7f8abed0707a0d5ed4eb743f6342c15c9e9383116920110f0d44a125a7&=&format=webp&quality=lossless&width=918&height=685)

Here's the arrangement of the process described:
1. **User Application:** Initiates the file creation process by calling the CreateFile function from the WinAPI.
2. **Kernel32.dll:** Contains the CeateFile function. It's a crucial DLL that provides access to WinAPI functions and is commonly loaded by applications.
3. **Ntdll.dll:** Contains the equivalent NTAPI function NtCreateFile. CreateFilei nternally calls NtCreateFile.
4. **Assembly Instruction Execution:** Ntdll.dll executes an assembly sysenter (x86) or syscall (x64) instruction, transitioning the execution to kernel mode.
5. **Kernel Mode Execution:** The kernel NtCreateFile function is invoked. It interfaces with kernel drivers and modules to execute the requested file creation operation.

It is noteworthy that applications have the capability to directly call syscalls (i.e., NTDLL functions) without needing to utilize the Windows API. The Windows API essentially serves as a facade for the Native API. However, it's worth mentioning that the Native API is more challenging to use since it lacks official documentation from Microsoft.

Most internal Windows strings are implemented in **Unicode**, when you use the ANSI version of an API, Windows have to convert it to unicode and also when returning back from the API, this have a small performance impact.

## Process


A process is an instance of a program in execution.
Batch systems work in terms of "jobs". Many modern process concepts are still expressed in terms of jobs, ( e.g. job scheduling ), and the two terms are often used interchangeably.

    
A Process Consists of 
    
- A private virtual address space
- An executable program (image), which contains the initial code and data to be executed
- A table of handles to kernel objects
- A security context, called an access token, used for security checks when accessing shared resources
- One or more threads that execute code
    
Process are isolated from one another  
The executable cannot be considered a unique identifier because there are multiple processes, associated with the same executable.  

At the highest level of abstraction, a Windows process comprises the following:
- A private **virtual address space (VAS)**, which is a set of virtual memory addresses that the process can use.
- An **executable program**, which defines initial code and data and is mapped into the process’ VAS.
- A list of **open handles** to various system
    resources—such as semaphores, communication ports, and files — that are accessible to all threads in the process.
- A **security context** called an access token that
    identifies the user, security groups, privileges, User Account Control (UAC) virtualization state, session, and limited user account state associated with the process.
- A unique identifier called a **process ID** (internally part of an identifier called a client ID).
- At least **one thread of execution** (although an “empty” process is possible, it is not useful).
    
![https://media.discordapp.net/attachments/791571025368186890/1201244654532837466/image.png?ex=65c91d43&is=65b6a843&hm=a78b953a0bf8113ea461c451ca6f6e33def6087f299f2af37dc15d772b36e2f5&=&format=webp&quality=lossless&width=1144&height=441](https://media.discordapp.net/attachments/791571025368186890/1201244654532837466/image.png?ex=65c91d43&is=65b6a843&hm=a78b953a0bf8113ea461c451ca6f6e33def6087f299f2af37dc15d772b36e2f5&=&format=webp&quality=lossless&width=1144&height=441)
    
Processes may be in one of 5 states,   

- **New** - The process is in the stage of being created.
- **Ready** - The process has all the resources available that it needs to run, but the CPU is not currently working on this process's instructions.
- **Running** - The CPU is working on this process's instructions.
- **Waiting** - The process cannot run at the moment, because it is waiting for some resource to become available or for some event to occur. For example the process may be waiting for keyboard input, disk access request, inter-process messages, a timer to go off, or a child process to finish.
- **Terminated** - The process has completed.

    
Other details include:
    
- **Username**: Username of the machine
- **PID**- process identifier
- **Session Number**: 0 for system and 1 for the logged-on user.
- **Memory Active Private Working Set**: Represents the RAM utilized by the process for private memory, though it's not an ideal column for reference due to potential memory paging.
- **Commit Size**: Reflects the private memory committed to a process, indicating the actual memory utilized by the process for its private purposes.
- **Handle**: Each process maintains its handle table, indicating the number of handles existing within that process.
- **Threads**: The count should be at least 1, as each process creation necessitates at least one thread.
- **Platform**: Indicates whether the platform is 64-bit or 32-bit.
    
## Thread

A thread is a basic unit of CPU utilization, consisting of a program counter, a stack, and a set of registers, ( and a thread ID. )

A **thread** includes the following essential components:
    
- Set of **CPU registers** representing the **state** of the processor.
- **Two stacks**: one for the thread to use while executing in kernel mode and one for executing in user mode.
- A private storage area called **thread-local storage (TLS)** for use by subsystems, run-time libraries, and DLLs
- A unique identifier called a **thread ID** (part of an
    internal structure called a client ID—process IDs and thread IDs are generated out of the same namespace, so they never overlap).
- Threads sometimes have their own **security context**,
    or token, that is often used by multithreaded server applications that impersonate the security context of the clients that they serve.
    
![https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/images/Chapter4/4_01_ThreadDiagram.jpg](https://www.cs.uic.edu/~jbell/CourseNotes/OperatingSystems/images/Chapter4/4_01_ThreadDiagram.jpg)

Traditional ( heavyweight ) processes have a single thread of control - There is one program counter, and one sequence of instructions that can be carried out at any given time.

Multi-threaded applications have multiple threads within a single process, each having their own program counter, stack and set of registers, but sharing common code, data, and certain structures such as open files.

    
## Virtual Memory
    
![https://connormcgarr.github.io/images/PAGE_1.png](https://connormcgarr.github.io/images/PAGE_1.png)
    
In modern operating systems, memory is not directly mapped to physical memory (i.e., RAM). Instead, processes utilize virtual memory addresses that are mapped to physical memory addresses. The primary aim of this approach is to conserve physical memory. Virtual memory may reside in physical memory or be stored on disk. With virtual memory addressing, multiple processes can share the same physical address while possessing unique virtual memory addresses.
    
Virtual memory operates on the principle of Memory paging, which segments memory into 4kb-sized chunks called "pages".
    
Each process maintains its own private virtual address space, yet they can share physical memory, especially when they utilize the same code.
    
 **x86 vs x64 Memory Space**
    
![https://media.discordapp.net/attachments/791571025368186890/1201253335613845715/image.png?ex=65c92559&is=65b6b059&hm=c3efa1a2cfb62b9ae1267dd023be0a9453a2ed56a31d72bb228fb33d4597d58b&=&format=webp&quality=lossless&width=987&height=423](https://media.discordapp.net/attachments/791571025368186890/1201253335613845715/image.png?ex=65c92559&is=65b6b059&hm=c3efa1a2cfb62b9ae1267dd023be0a9453a2ed56a31d72bb228fb33d4597d58b&=&format=webp&quality=lossless&width=987&height=423)
    
When working with
    Windows processes, it's important to note whether the process is x86 or x64.
    
On 32-bit x86, a process can address **4GB of memory space**.
    
64-bit Windows provides a much larger address space for processes:
    
- **7152 GB** on IA-64 systems.
- **8192 GB** on x64 systems.
    
> **Memory Protection**
    Modern operating systems generally have built-in memory protections to thwart exploits and attacks. These are also important to keep in mind as they will likely be encountered when building or debugging the malware.
    
> **Data Execution Prevention (DEP)** 
DEP is a system-level memory protection
    feature that is built into the operating system starting with Windows XP and Windows Server 2003. If the page protection option is set to PAGE_READONLY, then DEP will prevent code from executing in that memory region.
    
> **Address space layout randomization (ASLR**)
ASLR is a memory protection
    technique used to prevent the exploitation of memory corruption vulnerabilities. ASLR randomly arranges the address space positions of key data areas of a process,
    including the base of the executable and the positions of the stack, heap and libraries
    
## DLL

A dynamic link library (DLL) is a collection of small programs that larger programs can load when needed to complete specific tasks. The small program, called a DLL file, contains instructions that help the larger program handle what may not be a core function of the original program.
    
- DLLs are loadable modules, mapped into a process address space
- Contains any of the following: code, data, resources
- Can be shared between processes
- Many DLLs provided out-of-the-box with Windows

![https://cdn.discordapp.com/attachments/791571025368186890/1201270329234968709/image.png?ex=65c9352d&is=65b6c02d&hm=5d8fa1178e6665d783a33e0397aeef785202976fa9d8eba9d982f4a02386d99f&](https://cdn.discordapp.com/attachments/791571025368186890/1201270329234968709/image.png?ex=65c9352d&is=65b6c02d&hm=5d8fa1178e6665d783a33e0397aeef785202976fa9d8eba9d982f4a02386d99f&)
    
## Job
    
- Windows provides an extension to the process model called a **job**.
- A job object’s main function is to allow groups of processes to be managed and manipulated as a unit.
- In some ways, the job object **compensates for the lack of a structured process tree** in Windows—yet in many ways it is more powerful than a UNIX-style process tree.
    
## Objects and Handles
    
- In the windows OS, for example: a file, process, thread or event object are examples of **kernel objects**, they are based on low level objects that Windows creates and manages (object manager).
- These objects are **opaque** meaning that you must call an object service to get/set data into it.
- Not all data structures in Windows are objects. Only data that needs to be shared, protected, named, or made visible to user-mode programs (via system services) is placed in objects .
    
## Registry
    
The registry is effectively a database that consists of a massive number of keys with associated values. These keys are sorted hierarchically using subkeys

- At the root, multiple registry hives contain logical divisions of registry keys. Information related to the current user is stored in the HKEY_CURRENT_USER (HKCU) hive, while information related to the operating system itself is stored in the HKEY_LOCAL_MACHINE (HKLM) hive.

- Since a 64-bit version of Windows can execute 32-bit applications each registry hive contains a duplicate section called Wow6432Node which stores the appropriate 32-bit settings
    
## Security
    
Windows has three forms of access control over objects:
- Discretionary Access Control (DAC).
- Pivileged access control (PAC)
- Mandatory Integrity Control (MAC
    
## Sysinternals Tools
    
- Various tools which helps diagnose, troubleshoot, and monitor the windows OS.
- The most popular tools include Process Explorer and Process Monitor.
- Heavily used in malware analysis.


