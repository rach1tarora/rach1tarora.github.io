---
layout: default
title: projects
---

### **Projects**

<br>

> **Sentinel Heatmap (RDP Bruteforce)**
    
- Used custom PowerShell script to extract metadata from Windows Event Viewer to be forwarded to third party API in order to derive geolocation data.

- Configured Log Analytics Workspace in Azure to ingest custom logs containing geographic information (latitude, longitude, state/province, and country)

- Used Azure Sentinel (Microsoft's cloud SIEM) workbook to display global attack data (RDP brute force) on world map according to physical location and magnitude of attack.

   - More information and the report <a href="https://arorarachit.com/blog/sentinel-heatmap-rdp-bruteforce" style="color:red;" rel="noopener">here</a> 

[![image.png](https://i.postimg.cc/SKjddT3G/image.png)](https://postimg.cc/XZS978VZ)


<br>


> **Tempus CTF**
    
    
- Created a CTF for NSS, which involved Forensic Analysis, Cryptography and Privilege Escalation ( Docker Container Breakout). 

    - More information about the challenge and the badge <a href="https://www.credly.com/org/noshitsecurity/badge/rage" style="color:red;" rel="noopener">here</a> .

- The first part of the  CTF will be finding a Private key(.pem) , which will grant them access to a Linux virtual machine (VM) hosted in Microsoft Azure.
They will then have a four-hour window to solve the challenges in the VM and the access would be given by Just-in-time (JIT) in Azure.

- The CTF comprised of the following Elements -

    - **Digital Forensics** and **Cryptography** ( Steganography, Morse Code, Public Key Cryptography , basic encryption, hashing and validation techniques.) 
    This will lead them to the Private key.

    - Once inside the VM, they will have to **Docker Breakout** to break-out of the container and then perform a **Privilege Escalation**.

- Everything in the VM is being monitored by **Microsoft Sentinel**.

    - A blog has been published <a href="https://arorarachit.com/blog/azure-sentinel-investigating-incidents" style="color:red;" rel="noopener">here</a> , analyzing the observations drawn from individuals attempting to compromise the VM.
    
    ![https://media.discordapp.net/attachments/928373179003600907/1155463014322016287/image.png?width=1672&height=666](https://media.discordapp.net/attachments/928373179003600907/1155463014322016287/image.png?width=1672&height=666)
    
	<br>

> **Active Directory Homelab**

- Gained hands-on experience and establish a strong foundation by setting up an Active Directory Homelab.

    - Custom Powershell script to populate users in the domain and the lab was made vulnerable using 'SafeBuffer Vulnerable-AD' .

- Learnt about Enumeration, Lateral Movement, Domain Privesc and Persistance.

- Practiced Attacks like Kerberoasting, AS-REP Roasting and DCSync and utilized tools like BloodHound, SharpHound, Powerview & ADModule.

- Fixed the vulnerabilities to explore the defensive aspect of the process.

<br>

* User1 Workstation → **Windows 11**
    
* User2 Workstation → **Windows 10**
    
* Company Domain Controller → **Windows Server 2022**

    
[![image.png](https://i.postimg.cc/GtJVZSs2/image.png)](https://postimg.cc/N2FdXDDq)

 <br>
