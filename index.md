---
layout: default
title: Hello
---

> ##### Contact

<!-- Add icon library -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<!-- Add font awesome icons -->
<a href="#" class="fa fa-twitter" href = "https://twitter.com/rach1tarora" target="_blank" rel="noopener" ></a> &nbsp; 
<a href="#" class="fa fa-steam" href = "https://steamcommunity.com/id/JediMindTr1cks" target="_blank" rel="noopener" ></a> &nbsp; 
<a href="#" class="fa fa-github" href = "https://github.com/rach1tarora" target="_blank" rel="noopener" ></a> &nbsp; 
<a href="#" class="fa fa-linkedin" href = "https://www.linkedin.com/in/rach1tarora/" target="_blank" rel="noopener" ></a> &nbsp; 

Mail <a href = "mailto:admin@arorarachit.com" target="_blank" rel="noopener"> arorarachit@protonmail.com </a>



> ##### Identity

You can verify me on <a href="https://keybase.io/rachitaroraa" target="_blank" rel="noopener">Keybase</a> 


I post stuff <a href="/blog" style="color:red;" rel="noopener">here</a> 

<br>

### Whoami

I'm Rachit Arora, and I have a keen interest in Cloud Security and both red/blue teaming. I'm constantly sharing blogs here, which consist of topics like 

- Penetration testing
- Hackthebox &  THM writeups
- Cloud Security
- Miscellaneous topics

Additionally, I am a student at University of Maryland, College Park where I am pursuing Masters of Engineering in Cybersecurity ( M.Eng Cybersecurity).

I'm currently searching for hybrid internships in the Washington, D.C. area for the fall of 2024.

Currently I’m learning stuff about C2 ( CobaltStrike, Havoc ) and trying my hands on reverse engineering. 

Preparing for [CRTO](https://training.zeropointsecurity.co.uk/courses/red-team-ops) → Concepts related to adversary simulation, command & control.

<br>

### Training & Certifications

All certifications can be verified on credly <a href="https://www.credly.com/users/rachit-arora.6027f270" style="color:red;" rel="noopener">here</a>

- [OffSec Certified Professional](https://www.credential.net/57148f07-f47e-497e-b34f-bb60c6ee28c3#gs.4w8fyh%5C) (OSCP)
- [Microsoft Certified: Azure Security Engineer Associate](https://www.credly.com/badges/1c258de3-a8dc-4586-b6a9-ff4d3a53c9b7) (AZ-500)
- [AWS Certified Cloud Practitioner](https://www.credly.com/badges/5d3ea344-ecf2-4e1e-82ed-ab175733dc48)
- [Microsoft Certified: Cybersecurity Architect Expert](https://www.credly.com/badges/fcfbfadf-81a1-490a-85c0-73ed7d2cebb5) (SC-100)
- [Microsoft Certified: Security, Compliance, and Identity Fundamentals](https://www.credly.com/badges/5b111be7-2ec8-441b-b77a-dbc61460dc7c) (SC-900)
- [eLearnSecurity Junior Penetration Tester](https://verified.elearnsecurity.com/certificates/f61e9c01-e250-4faa-99cb-869382a47ccd) (eJPT)

<br>
### Accomplishments

- Discovered and secured vulnerabilities in my undergrad college infrastructure.
    - Identified a bug in Groovy console which granted unauthorized command execution as root.
    - Discovered a vulnerability in Adobe AEM CMS that was implemented on the domain which granted complete file system access.
    - Fuzzed directories that were leaking student/professors PII.
    
    Received a letter of appreciation from the college
    

- Successfully reported few vulnerabilities on NCIIPC (Indian Gov RVDP)
    - Discovered PII information exposure through “forgot password” Functionality implemented on the domain.
    
    Received acknowledgment 
    
<br>

### **Projects**

<br>

> **Sentinel Heatmap (RDP Bruteforce)**
    
    
- Used custom PowerShell script to extract metadata from Windows Event Viewer to be forwarded to third party API in order to derive geolocation data.

- Configured Log Analytics Workspace in Azure to ingest custom logs containing geographic information (latitude, longitude, state/province, and country)

- Used Azure Sentinel (Microsoft's cloud SIEM) workbook to display global attack data (RDP brute force) on world map according to physical location and magnitude of attack.

More information and the report [here](https://www.google.com/)

<br>


> **Tempus CTF**
    
    
- Created a CTF for NSS, which involved Forensic Analysis, Cryptography and Privilege Escalation ( Docker Container Breakout). 

More information about the challenge and the badge <a href="https://www.credly.com/org/noshitsecurity/badge/rage" style="color:red;" rel="noopener">here</a> .

- The first part of the  CTF will be finding a Private key(.pem) , which will grant them access to a Linux virtual machine (VM) hosted in Microsoft Azure.
They will then have a four-hour window to solve the challenges in the VM and the access would be given by Just-in-time (JIT) in Azure

- The CTF comprised of the following Elements -

    - **Digital Forensics** and **Cryptography** ( Steganography, Morse Code, Public Key Cryptography , basic encryption, hashing and validation techniques.) 
    This will lead them to the Private key.

    - Once inside the VM, they will have to **Docker Breakout** to break-out of the container and then perform a **Privilege Escalation**

- Everything in the VM is being monitored by **Microsoft Sentinel**

    - A blog has been published <a href="https://arorarachit.com/blog/azure-sentinel-investigating-incidents" style="color:red;" rel="noopener">here</a> , analyzing the observations drawn from individuals attempting to compromise the VM
    
    ![https://media.discordapp.net/attachments/928373179003600907/1155463014322016287/image.png?width=1672&height=666](https://media.discordapp.net/attachments/928373179003600907/1155463014322016287/image.png?width=1672&height=666)
    
	<br>

    > **Active Directory Homelab**

    - Gained hands-on experience and establish a strong foundation by setting up an Active Directory Homelab.

        - Custom Powershell script to populate users in the domain and the lab was made vulnerable using 'SafeBuffer Vulnerable-AD' .

    - Learnt about Enumeration, Lateral Movement, Domain Privesc and Persistance.

    - Practiced Attacks like Kerberoasting, AS-REP Roasting and DCSync and utilized tools like BloodHound, SharpHound, Powerview & ADModule.

    - Fixed the vulnerabilities to explore the defensive aspect of the process.
    
    ![https://media.discordapp.net/attachments/928373179003600907/1161195925205700641/image.png?ex=65376afa&is=6524f5fa&hm=6efaa284f784e6fde5b39c3c1430ca3e9a081f75cb00064c8c0198677c97d406&=&width=712&height=406](https://media.discordapp.net/attachments/928373179003600907/1161195925205700641/image.png?ex=65376afa&is=6524f5fa&hm=6efaa284f784e6fde5b39c3c1430ca3e9a081f75cb00064c8c0198677c97d406&=&width=712&height=406)
    
    User1 Workstation → **Windows 11**
    
    User2 Workstation → **Windows 10**
    
    Company Domain Controller → **Windows Server 2022**
    