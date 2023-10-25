---
layout: post
title: Shodan Dorks
date: 2022-12-19 1:58:47 +05:30
tags: [dorks,shodan,web]
description: Shodan is a search engine for Internet-connected devices. Dorks help to narrow down output.
---


> ## SMB
```
port:445 "Authentication Disabled"
port:445 "Authentication disabled"
port:445 "Authentication disabled" "sysvol"
port:445 "Authentication disabled" "student"
"Authentication: disabled" NETLOGON SYSVOL -unix port:445
```

> ## RDP

```
port:3389,5900,5800 has_screenshot:true "accounting"
port:3389,5900,5800 has_screenshot:true "HR"
```

> ##  Anonymous FTP
```
port:21 "230"
```


> ## Elastic
```
port:1433,1434,3306,3050,5432,3351,1583,5984,9200,9300 "Total Size"
port:9200 product:elastic
```

> ## Jenkins
```
"X-Jenkins" "Set-Cookie: JSESSIONID" http.title:"Dashboard" 
```

> # Using Shodan during recon

* http.title
```
http.title:"TITLE"
```
* phpinfo & directory listing
```
http.title:"Index of /" http.html:"phpinfo.php"
http.title:"Index of /" http.html:"phpinfo.php" country:US 
#directory listing
http.title:"Index of /"
```

> # Narrow down target using these dorks

```
organisation-  certificate SSL name
ssl:"Example"
ssl.cert.subject.CN:"Example.com"
```
* Removing particular output
```
-http.title:"Invalid URL"
-ssl.cert.subject.CN:"website.com.cn"
```

> # Other Recon tips
```
http.title:"sign up" http://ssl.cert.subject.cn:"${target}" http.title:"sign up" ssl:"${target}" "sign up" http://ssl.cert.subject.cn:"${target}" "sign up" ssl:"${target}"
```

> # Dorks combined
```
title:”kibana” port:”443"
”230 login successful” port:”21"
vsftpd 2.3.4 port:21
230 ‘anonymous@’ login ok
set-cookie: webvpn;
Siemens S7
vsftpd 3.0.3
Set-Cookie: phpMyAdmin
Set-Cookie: lang=
Set-Cookie: PHPSESSID
Set-Cookie: webvpn
Set-Cookie:webvpnlogin=1
Set-Cookie:webvpnLang=enHow to do this appropriately
Set-Cookie: mongo-express=
Set-Cookie: user_id=
Set-Cookie: phpMyAdmin=
Set-Cookie: _gitlab_session
X-elastic-product: Elasticsearch
x-drupal-cache
access-control-allow-origin
WWW-Authenticate
X-Magento-Cache-Debug
kbn-name: kibana
X-App-Name: kibana
x-jenkins
org:’company’ port:’80, 81, 443, 8000, 8001, 8008, 8080, 8083, 8443, 8834, 8888'.
site:target.com
inurl:admin
intitle:login
site:website.com
intitle:/admin
site:website.com
inurl:admin
intitle:admin
intext:admin
kibana content-length:217 net:cidr
html:Dashboard Jenkins http.component:jenkins
X-Amz-Bucket-Region
x-jenkins 200
X-Generator: Drupal 7
all:mongodb server information all:metrics
port:27017 -all:partially all:fs.files
port:9200" all:elastic indices
product:elastic port:9200
title:system dashboard html:jira
product: apache tomcat
html:secret_key_base
html:rack.version
title:Citrix Gateway org:*programorg*
authentication disabled RFB 003.008
html:/dana-na/
Docker Containers: port:2375
root@ port:23 -login -password -name -Session
Cisco IOS ADVIPSERVICESK9_LI-M
Server: NessusWWW
230 login successful port:21"
```

> # Other Resources
```
https://securitytrails.com/blog/top-shodan-dorks
https://twitter.com/AseemShrey/status/1508059759491964928?s=20
https://github.com/lothos612/shodan
https://mr-koanti.github.io/shodan
https://github.com/jakejarvis/awesome-shodan-queries
https://www.osintme.com/index.php/2021/01/16/ultimate-osint-with-shodan-100-great-shodan-queries/
https://systemweakness.com/elasticsearch-a-easy-win-for-bug-bounty-hunters-how-to-find-and-report-ddd900395bcb
https://gist.github.com/anselmo/ab18baebfdf459c38c017538a4daf49b
https://medium.com/@D0rkerDevil/3k-bounty-for-elastic-search-takeover-70c0847d2e40
https://elbazi.me/how-hackers-can-find-your-exposed-elasticsearch-clusters-using-shodan-c8086a3f1ed2
https://www.blackhatethicalhacking.com/tools/awesome-shodan-queries/
```


## Have any questions
Do you have any questions? Feel free to reach out to me on [twitter](https://twitter.com/rach1tarora) or on [LinkedIn](https://www.linkedin.com/in/rach1tarora/).