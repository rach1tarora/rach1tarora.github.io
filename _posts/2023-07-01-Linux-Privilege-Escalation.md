---
layout: post
title:  "Linux Privilege Escalation"
date:   2023-07-01 09:29:20 +0700
tags: [linux,privesc,pentesting]
categories: jekyll update
usemathjax: true
---

> # Manual Enumeration

> ##### Find SUID and GUID files

```bash
find / -perm -u=s -type f 2>/dev/null
find / -perm -g=s -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null

#Find all the SUID/SGID executables on the Debian VM:
find / -type f -a \( -perm -u+s -o -perm -g+s \) -exec ls -l {} \; 2> /dev/null
```

> ### Quick and easy wins
> ###### Shell binaries with SUID bit set on them

```bash
ls -al /bin/bash
ls -al /bin/sh
ls -al /bin/dash
```
> ###### SSH keys
```bash
find / -name id_rsa 2> /dev/null
find / -maxdepth 5 -name .ssh -exec grep -rnw {} -e 'PRIVATE' ; 2> /dev/null
```

> ###### Find commands

```bash
find . -name flag1.txt
find /home -name flag1.txt
find / -type d -name config
#find files with the 777 permissions (files readable, writable, and executable by all users)
find / -type f -perm 0777
# find executable files
find / -perm a=x
find /home -user frank
#find files that were modified in the last 10 days
find / -mtime 10
#find files that were accessed in the last 10 day
find / -atime 10
#find files changed within the last hour (60 minutes)
find / -cmin -60
#find files accesses within the last hour (60 minutes)
find / -amin -60
# find files with a 50 MB size
find / -size 50M
```
> ###### Folders and files that can be written to or executed from: 

```bash
#writeable
find / -perm -o w -type d 2>/dev/null
#executable
find / -perm -o x -type d 2>/dev/null
```
