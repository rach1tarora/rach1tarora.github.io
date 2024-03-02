---
layout: post
title:  "Cobalt Strike - Operations "
date:   2023-10-10 09:19:20 +0700
tags: [pentesting,cobaltstrike]
categories: jekyll update
usemathjax: true
---

Notes from "Red Team Operations with Cobalt Strike (2019)" by Raphael Mudge on Youtube <a href="https://www.youtube.com/watch?v=q7VQeK533zI&list=PL9HO6M_MU2nfQ4kHSCzAQMqxQxH47d1no&index=1" style="color:red;" rel="noopener">here</a> 

![https://media.discordapp.net/attachments/928373179003600907/1161604293552504914/image.png?ex=6538e74d&is=6526724d&hm=53cf4c43dcba8f94edc95e3196e292350488209a9139525051eef0e99000e02c&=&width=1074&height=816](https://media.discordapp.net/attachments/928373179003600907/1161604293552504914/image.png?ex=6538e74d&is=6526724d&hm=53cf4c43dcba8f94edc95e3196e292350488209a9139525051eef0e99000e02c&=&width=1074&height=816)

### General Overview of a Red Team Operation

There are four goals of a typical attack

- Artifact on target/ Initial access
- Code execution
- Positive C&C (C2) Command & Control
- Post exploitation

![https://media.discordapp.net/attachments/928373179003600907/1161602009657524285/image.png?ex=6538e52c&is=6526702c&hm=2c2959deae86fe7807c5964a95ed2bd6878c68884b3b81af3c1a551a341a1a38&=&width=1074&height=769](https://media.discordapp.net/attachments/928373179003600907/1161602009657524285/image.png?ex=6538e52c&is=6526702c&hm=2c2959deae86fe7807c5964a95ed2bd6878c68884b3b81af3c1a551a341a1a38&=&width=1074&height=769)

The screenshot provided outlines the four objectives and the difficulties associated with each of them.

**Challenges in Email Delivery:**

1. We face obstacles when sending emails, such as antivirus gateways or sandbox technology that dynamically inspect attachments to check for malicious content.
2. Dealing with various anti-spam and filtering mechanisms.
3. Implementing security protocols like SPF, DKIM, and DMARC can make it more challenging to ensure the email successfully reaches its destination.

**Challenges Before Code Execution:**

1. Endpoint security products can interfere before the malicious code is executed.
2. Both static and dynamic analysis are conducted on our content and payload to determine potential threats.
3. Everything in our environment is monitored, including antivirus software and EDR (Endpoint Detection and Response) systems.
4. Events generate telemetry, which is then sent to the Security Operations Center (SOC) for analysis by individuals looking for signs of security breaches.

**Challenges Before Establishing Command and Control (C2):**

1. Communicating with a domain that is not categorized, making it difficult to establish a connection.
2. Coping with network security monitoring, like detecting unusual user agents, which could trigger investigations.

**Challenges in Post-Exploitation:**

1. Evaluating the risk versus reward for each action taken.
2. Every action generates observable events that are monitored by a local agent or produce telemetry data sent to the SOC for analysis.

## Cobalt Strike and its functionalities

**Mission**: Minimize the gap between penetration testing and advanced threat malware.
**Vision**: Attain adversary simulation that is pertinent and trustworthy.

> ### Beacon

- Beacon: Cobalt Strike's Payload
- Two Communication Strategies:
    - Asynchronous **"Low and Slow"**: It will connect to Cobalt Strike (CS) rarely, such as once a day, minute, or week.
    - Interactive **Real-time Control**: Achieved through the beacon payload. Used for tunneling and pivoting with the CS beacon.
- Uses HTTP/S or DNS to Egress a Network
- Uses SMB or TCP for Peer-to-Peer Command and Control (C2)
- Remote Administration Tool Features

> ### **Malleable C2**

- A Domain-Specific Language: Used to provide control over the indicators in the Beacon payload.
- Indicators You Can Control:
    - Network Traffic
    - In-Memory Content, Characteristics, and Behavior
    - Process Injection Behavior
    
    A screenshot of a malleable C2 profile and a screenshot of the HTTP traffic generated based on this profile.
    
    ![https://media.discordapp.net/attachments/928373179003600907/1161606121795104818/image.png?ex=6538e901&is=65267401&hm=4d30af1073cb8e8901e00827323c03ba8459e53cbf0ecccdbed2efb9574bec45&=&width=1074&height=762](https://media.discordapp.net/attachments/928373179003600907/1161606121795104818/image.png?ex=6538e901&is=65267401&hm=4d30af1073cb8e8901e00827323c03ba8459e53cbf0ecccdbed2efb9574bec45&=&width=1074&height=762)
    
> ### **Aggressor Script**
    
- The scripting language integrated into Cobalt Strike, available from version 3.0 onwards.
- It enables you to customize and expand the capabilities of the Cobalt Strike client.
    
1. Customization: It's possible to incorporate pop-up menus, introduce additional commands, and enable scripts to react to emerging events within the tool.
2. Enhanced Privilege Escalation and Lateral Movement: We can implement new methods for privilege escalation and lateral movement automation.
3. Versatile Scripting: These scripts have the capability to modify the tool's behavior, resulting in the creation of various file types, including executables (exe), dynamic link libraries (DLLs), and even PowerShell scripts.

### **Collaboration Features in Cobalt Strike**

![https://media.discordapp.net/attachments/928373179003600907/1161607418288033802/image.png?ex=6538ea36&is=65267536&hm=139746ed5b94e77e20a107b0aa3df9da117e309d78615170ce8eeb52e54d5caf&=&width=1074&height=654](https://media.discordapp.net/attachments/928373179003600907/1161607418288033802/image.png?ex=6538ea36&is=65267536&hm=139746ed5b94e77e20a107b0aa3df9da117e309d78615170ce8eeb52e54d5caf&=&width=1074&height=654)

The "team server" functions as the command center for the tool, coordinating offensive actions. It serves as the controller, hosts a web server, and is instrumental in facilitating spear phishing. The Cobalt Strike graphical user interface (GUI) client connects to this server.

> **Starting a Team Server**

![https://media.discordapp.net/attachments/928373179003600907/1161608391731466300/image.png?ex=6538eb1e&is=6526761e&hm=c75ab79450b8f99b5c9a9db9f87b35e5b08d264d2dc7d2797eec53cd4b357792&=&width=1074&height=679](https://media.discordapp.net/attachments/928373179003600907/1161608391731466300/image.png?ex=6538eb1e&is=6526761e&hm=c75ab79450b8f99b5c9a9db9f87b35e5b08d264d2dc7d2797eec53cd4b357792&=&width=1074&height=679)

![https://media.discordapp.net/attachments/928373179003600907/1161608725015052288/image.png?ex=6538eb6d&is=6526766d&hm=f2b057d552fa7e53f7b7a6d501ea8e4c79008aa2a1c2ac4a55e98a04c69b10ee&=&width=1074&height=129](https://media.discordapp.net/attachments/928373179003600907/1161608725015052288/image.png?ex=6538eb6d&is=6526766d&hm=f2b057d552fa7e53f7b7a6d501ea8e4c79008aa2a1c2ac4a55e98a04c69b10ee&=&width=1074&height=129)

Starting a team server screenshot 

![https://media.discordapp.net/attachments/928373179003600907/1161608965961039924/image.png?ex=6538eba7&is=652676a7&hm=3aa11bae518da2632fb54a660d63af252a890e2d001018210f928fd197c68d2e&=&width=1074&height=127](https://media.discordapp.net/attachments/928373179003600907/1161608965961039924/image.png?ex=6538eba7&is=652676a7&hm=3aa11bae518da2632fb54a660d63af252a890e2d001018210f928fd197c68d2e&=&width=1074&height=127)

- Host's Default IP: The host system's preconfigured IP address.
- Shared Password: A common password that clients will employ to connect to the team server.
- Optional Custom C2 Profile: It's possible to select a malleable C2 profile, although it's essential to have a robust and secure profile in place instead of the default one.

> **Connecting to a team Server**

![https://media.discordapp.net/attachments/928373179003600907/1161609312653803590/image.png?ex=6538ebf9&is=652676f9&hm=1dca8b356cae33fc17ac9a39ecf3686ae718aa6147ff0e666cfe6cf062d1ce73&=&width=1074&height=660](https://media.discordapp.net/attachments/928373179003600907/1161609312653803590/image.png?ex=6538ebf9&is=652676f9&hm=1dca8b356cae33fc17ac9a39ecf3686ae718aa6147ff0e666cfe6cf062d1ce73&=&width=1074&height=660)

username: leet hacker nickname

we can match the sha256 hash

[![image.png](https://i.postimg.cc/8zXrmXwH/image.png)](https://postimg.cc/CRD1FN3B)

> **Basic Interface of Cobalt Strike** 

[![image.png](https://i.postimg.cc/s215FC1q/image.png)](https://postimg.cc/cKyvYjRB)

Three elements of a collaborative red team tool include:

1. Sharing Sessions: Collaborators can jointly access and control sessions.
2. Data Collaboration: Both parties have access to the same data model for shared information.
3. Instant Communication: Real-time communication akin to an event log, functioning similar to an internet relay chat.

/sc to show channel

/me to display an action

/msg to message our teammates

[![image.png](https://i.postimg.cc/P5S1F5f1/image.png)](https://postimg.cc/NKryKYH0)

## **Distributed Operations**

[![image.png](https://i.postimg.cc/T3dr9DxR/image.png)](https://postimg.cc/Cz2BMddt)

Employing distributed operations to prevent dependence on a single vulnerable point.

[![image.png](https://i.postimg.cc/Y2Ffq78w/image.png)](https://postimg.cc/vDQ63ppP)

> **Team Infrastructure:**

- **Staging Servers:**
    - Host client-side attacks and initial callbacks.
    - Execute initial privilege escalation and install persistence.
    - These servers are expected to be detected quickly.
- **Long Haul Servers:**
    - Utilized for "low and slow" persistent callbacks.
    - Pass accesses to post-exploitation as necessary.
- **Post-Exploitation Servers:**
    - Dedicated to post-exploitation activities and lateral movement.
    

> **Team Roles:**

- **Access:**
    - Focus on gaining initial access and expanding the foothold.
- **Post Exploitation:**
    - Specialized in data mining, monitoring users, key logging, and similar activities.
- **Local Access Manager (Shell Sherpa):**
    - Responsible for managing callbacks, setting up infrastructure, ensuring persistence, and facilitating the exchange of sessions with the global access manager.
    
### **Logging & Reporting**
    
[![image.png](https://i.postimg.cc/8k494hQ5/image.png)](https://postimg.cc/6T7M54QJ)
    
[![image.png](https://i.postimg.cc/brg72n8Z/image.png)](https://postimg.cc/CnZP3zR0)
    
> **Reporting:**
    
- **Purpose:** Designed with the intention to assist and train blue teams.
- **Accessing Reporting Menu:** Navigate to the Reporting menu.
- **Key Features:**
- Capable of generating reports in PDF and MS Word document formats.
- Allows for the creation of custom reports and the option to change the logo.
- **Configuration Location:** Access the reporting settings in Cobalt Strike through "Cobalt Strike -> Preferences -> Reporting."
- **Data Merging:** It can merge data from multiple team servers while ensuring clock correction.
    
![https://cdn.discordapp.com/attachments/928373179003600907/1161612435816452207/image.png?ex=6538eee2&is=652679e2&hm=645c46d2d00c9714501e62cdc155c3b98921982e0a4435c1b5bf058b81fee18d&](https://cdn.discordapp.com/attachments/928373179003600907/1161612435816452207/image.png?ex=6538eee2&is=652679e2&hm=645c46d2d00c9714501e62cdc155c3b98921982e0a4435c1b5bf058b81fee18d&)
    
![https://cdn.discordapp.com/attachments/928373179003600907/1161612473225457776/image.png?ex=6538eeeb&is=652679eb&hm=ee3ca29d5e27c7bb85bb6ccc6cb6772bc431a65e2732b37ca0be62dbee721b5e&](https://cdn.discordapp.com/attachments/928373179003600907/1161612473225457776/image.png?ex=6538eeeb&is=652679eb&hm=ee3ca29d5e27c7bb85bb6ccc6cb6772bc431a65e2732b37ca0be62dbee721b5e&)
    
![https://cdn.discordapp.com/attachments/928373179003600907/1161612488656297984/image.png?ex=6538eeef&is=652679ef&hm=5412e0a85851427ad08ad7acaa9f22698493977167d68876eef18239f7f7b66e&](https://cdn.discordapp.com/attachments/928373179003600907/1161612488656297984/image.png?ex=6538eeef&is=652679ef&hm=5412e0a85851427ad08ad7acaa9f22698493977167d68876eef18239f7f7b66e&)
    
[![image.png](https://i.postimg.cc/TPWvHhjs/image.png)](https://postimg.cc/3y7qk8cj)

> More information about Cobalt Strike in the upcoming blogs


## Have any questions
Do you have any questions? Feel free to reach out to me on [twitter](https://twitter.com/rach1tarora) or on [LinkedIn](https://www.linkedin.com/in/rach1tarora/).