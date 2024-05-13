---
layout: post
title: Subdomain Enumeration
date: 2023-12-29 1:28:47 +05:30
tags: [web]
description: Subdomain Enumeration
---

> #### Using subfinder
```
subfinder -d hltv.org -all -cs | tee  domains.txt
```
> ##### Cleaning up urls
```bash
cat domains.txt | cut -d "," -f 1 | tee domains.txt
```
> ##### Getting hosts of the domain
```bash
 cat domains.txt | xargs -I{} host {} | tee -a host.txt
```

> ##### Using HTTPX

```bash
cat domains.txt | httpx -wc -sc -cl -ct -asn -web-server -o httpxout.txt -p 8000,8080,8443,443,8008,3000,5000,9090,900,7070,9200,15672,9000 -threads 75 -location

```
Using ASN, you can go to ipinfo and get all the ip ranges.

- And then later, go to shodan and search that ip range

```
Net:10.200.11.0/24
asn:ASN
```

> ##### Reverse who is
```bash
crt.sh
Crt.sh/?O=Paypal,%20inc.&output=json
```

> ##### Finding ASN's
```bash
amass intel -asn ASN | tee -a asn.txt
```

> ##### Using tlsx
We can give a range of ip addr, it will give us the domains that are there on that

```bash
echo 173.0.84.0/24 |tlsx -san -cn -silent
```

> ##### Using WaybackURLs

```bash
waybackurls example.com
```

## Have any questions
Do you have any questions? Feel free to reach out to me on [twitter](https://twitter.com/rach1tarora) or on [LinkedIn](https://www.linkedin.com/in/rach1tarora/).