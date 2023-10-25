---
layout: post
title:  "Sentinel Heatmap (RDP bruteforce)"
date:   2023-09-12	 09:29:20 +0700
tags: [rdp,azure,siem,cloud,defence]
categories: jekyll update
usemathjax: true
---


During my college , I created a project on Azure that monitors and records all attempted RDP (Remote Desktop Protocol) bruteforce attacks, and then presents this data as a heatmap for easy visualization.

This is a report not a guide.

![https://media.discordapp.net/attachments/854292624754999296/1151130590351986748/Picture1.png?width=1410&height=670](https://media.discordapp.net/attachments/854292624754999296/1151130590351986748/Picture1.png?width=1410&height=670)

> ###  ABSTRACT

In the current landscape, while countless new applications are developed, only a handful prioritize incorporating robust security measures. Various attack vectors, ranging from simple client-side exploits to intricate server-side breaches and social engineering, pose threats to system integrity.

This document centers on a straightforward method: brute-forcing or password spraying. This technique involves an attacker attempting numerous username and password combinations on an RDP (Remote Desktop Protocol) honeypot, designed to attract malicious actors.

We would then create a detailed heatmap which illustrates all the attacks worldwide that are attempting to gain unauthorized access to a Windows virtual machine by brute-forcing RDP port. The raw data columns would contain information like IP, latitude, longitude, username and other geolocation data

By logging and examining all these failed attempts using Log Analytics Workspace and Sentinel (Microsoft’s SIEM) , we can obtain a deeper insight into these attacks and figure out the most effective ways to protect our infrastructure against them. We can leverage AbuseIPDB which can be used to cross check the IP that attempts to tries to log into our infrastructure and later help the community to combat the spread of spammers, hackers and abusive activity on the internet

> ###  INTRODUCTION

### General Overview of the Problem

Remote Desktop Protocol (RDP) is a commonly utilized technology enabling users to remotely connect to and manage computers and servers through network connections. Its widespread application includes purposes like remote administration, technical assistance, and facilitating remote work within organizations.

Nonetheless, the ease of using RDP brings along inherent dangers. Cybercriminals frequently target RDP due to its susceptibilities, taking advantage of vulnerabilities, inadequate authentication, or misconfigurations to illicitly infiltrate systems. RDP brute force denotes a form of cyber-attack wherein an attacker methodically endeavors to gain unauthorized entry to a network by persistently guessing or employing a "brute force" approach to crack the password of an RDP account.

"In the 2022 Attack Surface Threat Report, it was revealed that around 25% of identified vulnerabilities on the attack surface were associated with RDP servers being exposed.".

There could be many weaknesses, but a few of them could include

1. Weak passwords;
2. Outdated versions of RDP potentially using flawed CredSSP, the encryption mechanism, thus enabling a potential man-in-the-middle attack;
3. Allowing unrestricted access to the default RDP port (TCP 3389); and
4. Allowing unlimited login attempts to a user

Brute-force attackers generally operate where there is a large attack surface area. The rise in the number of RDPs exposed to the internet during the pandemic has given them an especially large surface area to target; hence the surge in attacks.

The increase and ongoing prevalence of hybrid and remote work setups, combined with cost- effectiveness, the reduced need for specialized skills, and the broad appeal among novices and experienced cybercriminals, have collectively fueled the heightened adoption of RDP

> ###  Problem Definition

The security of devices possessing public IP addresses and linked to the internet presents a significant attack surface, attributed to persistent attacks executed by hackers manually or leveraging automated bots to scan for susceptible hosts.

This exposes even devices lacking sensitive data or adequate protective measures to the peril of unauthorized intrusion, as hackers perceive them as exploitable targets of opportunity. This concern is further amplified by the widespread practice of employing default usernames and passwords, simplifying attackers unauthorized access attempts and potentially leading to severe security breaches.

A particularly critical aspect is the potential vector of unauthorized entry through Remote Desktop Protocol (RDP). Such a breach could have devastating consequences for an organization, allowing hackers access to internal IP networks.

Moreover, in instances where the compromised machine is linked to a domain, it opens a gateway to the broader Active Directory Forest, setting the stage for subsequent acts of enumeration and attacks, all aimed at acquiring elevated privileges, including domain administrator status.

This sequence of events culminating in a hostile takeover of domain administration could precipitate the collapse of the entire organizational structure. This is critical for ensuring data integrity and allowing team members to collaborate.

This honeypot will allow users to witness and analyze attackers mindset while brute forcing RDP. The following steps will be followed in the development of this honeypot:

1. **Requirements gathering:** In this phase, the requirements of the honeypot will be identified. It includes understanding the features that the whole project should
2. **Design:** Understanding which protocol we need to work on, and how do we need to approach to make it a honeypot
3. **Development:** This phase includes developing the VM and configuring the PowerShell script to extract Geolocation using API
4. **Testing:** Exposing our VM onto the internet and make sure everything is working, while checking the windows event viewer
5. **Visualization:** Once everything is working, we would visualize it using a workbook in Microsoft Sentinel
6. **Maintenance:** This phase involves maintaining the number of Bruteforce requests coming in per second and our API calls doesn’t get exhausted.

> ###  DESIGN STRATEGY

The design strategy used for this project was Architectural diagram:

###  Architectural Diagram


![https://cdn.discordapp.com/attachments/854292624754999296/1151132006114136105/image.png](https://cdn.discordapp.com/attachments/854292624754999296/1151132006114136105/image.png)

**Overall Honeypot Architecture** 

This is the overall structure on how the whole honeypot works.

The architecture is made up of three major components:

The user interface is the front-end component of the application with which users interact.

**Attacker**: This is the entity that is an adversary and attacks our infrastructure

**VM**: It is called our infrastructure, the adversary tries to attack this

**Microsoft Azure**: The cloud which we will be using to analyze and visualize the log

![https://cdn.discordapp.com/attachments/854292624754999296/1151133074722136064/image.png](https://cdn.discordapp.com/attachments/854292624754999296/1151133074722136064/image.png)

The virtual machine setup provides insights into its configuration. When attackers attempt unauthorized access, their actions generate log files in the event viewer. By employing a powershell script, we can extract the IP address from these logs and use an IPgeolocationAPI to obtain geographic details. This cycle continues as long as the machine remains active, or until we configure firewalls for protection. All this information is then stored in a text file.

![https://media.discordapp.net/attachments/854292624754999296/1151133265269358592/image.png?width=1410&height=880](https://media.discordapp.net/attachments/854292624754999296/1151133265269358592/image.png?width=1410&height=880)

We then integrate our VM  with the log analytic agent and Microsoft sentinel and later use a workbook to visualize it.

> ### IMPLEMENTATION DETAILS

As previously said, the primary goal of the project is to create a honeypot, that lures in the attacker so that when they try bruteforcing, we can capture their IP and their geolocation. Later on visualize it for our threat analysis or report to AbuseIP Database.

The attacker first enumerates using “nmap” to see what ports are open, and what is the target name and probable “username”

The attacker then creates a custom username and password list to try and bruteforce the port and further analyze the results of the attack.

We enumerated our VM down below

![https://media.discordapp.net/attachments/854292624754999296/1151134069422305360/image.png?width=1410&height=580](https://media.discordapp.net/attachments/854292624754999296/1151134069422305360/image.png?width=1410&height=580)

This is how a basic nmap scan looks like when we are enumerating our VM

![https://cdn.discordapp.com/attachments/854292624754999296/1151134961261367367/image.png](https://cdn.discordapp.com/attachments/854292624754999296/1151134961261367367/image.png)

 [-] indicates wrong password

 [+] indicates correct password

“Pwned” means the user is local admin ie: He has administrative Privileges.

**Victim ( Honeypot ) Perspective:**

![https://media.discordapp.net/attachments/854292624754999296/1151135420197900390/image.png?width=1410&height=556](https://media.discordapp.net/attachments/854292624754999296/1151135420197900390/image.png?width=1410&height=556)

In this we can see a lot of “failure” and “success” logs being stored, The “ Source Network Address” Reveals the attacker IP

![https://media.discordapp.net/attachments/854292624754999296/1151135991885738015/image.png?width=1410&height=948](https://media.discordapp.net/attachments/854292624754999296/1151135991885738015/image.png?width=1410&height=948)

Once the logs have been populated, we can manually parse through each log if we want, or we Can decide to further analyze the logs on abuseipdb

![https://media.discordapp.net/attachments/854292624754999296/1151136011674456064/image.png?width=1410&height=678](https://media.discordapp.net/attachments/854292624754999296/1151136011674456064/image.png?width=1410&height=678)

The provided screenshot reveals that among the IPs in our log, one of them is flagged as abusive due to its involvement in various malicious activities and has been reported as such. In response, we have the option to include this specific IP in our blacklist, effectively preventing any communication or interaction with it moving forward. This action helps to safeguard our systems and network by ensuring that this problematic IP address is barred from accessing our resources.

![https://media.discordapp.net/attachments/854292624754999296/1151136035422601286/image.png?width=1390&height=1138](https://media.discordapp.net/attachments/854292624754999296/1151136035422601286/image.png?width=1390&height=1138)

The image displayed provides an overview of RDP brute force attempts over the past 30 days, originating from various locations globally. While a small number of these attempts, including one associated with my own "successful" endeavor, are legitimate, a substantial 99% majority of these instances are malicious in nature. These malicious attempts aim to gain unauthorized access to my virtual machine, underscoring the importance of fortifying our system's defenses against such threats.

> ### Summary of Achievements

The notable achievement involves the creation of a comprehensive heatmap showcasing global brute force attacks. These attacks strive to gain unauthorized entry to Windows virtual machines by relentlessly trying to breach multiple accessible ports ( In this case RDP) . The heatmap is enriched with data presenting crucial details such as IP addresses, geographical coordinates (latitude and longitude), usernames, and additional geolocation information.

Through a process of recording and analyzing these unsuccessful authentication, using Microsoft's Log Analytics Workspace and Sentinel (a Security Information and Event Management system), we gain profound insights into these attack patterns. This output allows us to formulate optimal strategies for safeguarding our infrastructure. Additionally, the utilization of AbuseIPdb aids in verifying the IPs attempting to breach our systems, and then we can manually blacklist each of them to make sure those IPs are pre-restricted.

> ### Main difficulties encountered and how they were tackled

Several challenges emerged during the construction phase of this project. Ensuring the security of our infrastructure was a significant concern, given the high volume of individuals attempting brute force attacks. Effective cost management was also crucial since the cloud-hosted nature of the setup demanded careful monitoring of VM usage to prevent escalating expenses. The restrictions on API requests posed another hurdle, as there is a limited pool of geolocation IPs available for integration into our workbook. Moreover, the powershell script itself required careful coding to extract IPs from the event viewer and subsequently utilize the API for geolocation retrieval.

> ### Limitations of the Project

We have implemented just one Machine, but in an infrastructure, there are thousands of machine to be taken care of, so we have to make a script that automates this.

RDP is just one of the vast attack surface area. This could be implemented in other various protocols, but could get cumbersome and messy

> ### Future Scope of Work

We can modify this RDP for different purpose, different protocols like FTP, SMB which are exposed to the internet and add up to the list of attack surface.

This data can be used by the SOC team to address multiple problems, like BruteForce, phishing and block the employees from these IP so that they cannot access these over the internet


## Have any questions
Do you have any questions? Feel free to reach out to me on [twitter](https://twitter.com/rach1tarora) or on [LinkedIn](https://www.linkedin.com/in/rach1tarora/).