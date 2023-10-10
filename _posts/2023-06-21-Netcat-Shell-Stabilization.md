---
layout: post
title: Netcat Shell Stabilization
date: 2023-06-21 11:58:47 +05:30
modified: 2023-06-27 16:49:47 +05:30
tags: [shell,netcat,pentesting]
description: Netcat shells are unstable by default, but they can be improved and stabilised using Python.
---

##### Python
```bash
python -c 'import pty; pty.spawn("/bin/bash")'
# or
python3 -c 'import pty; pty.spawn("/bin/bash")'
```

##### Path
```bash
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/tmp

export TERM=xterm-256color
```

##### Additional Steps you gotta do

```bash
alias ll='ls -lsaht --color=auto'
# ctrl+z [To Background the Process]
stty raw -echo ; fg ; reset
stty columns 200 rows 200
```
<br>
This Should be enough to stabilize a netcat shell.
If you feel this is not enough, try google.