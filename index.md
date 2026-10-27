---
layout: default
title: Rachit Arora
description: Security engineer working on red teaming, penetration testing, and vulnerability research.
---

<header class="home-hero">
  <h1 class="home-name">RACHIT ARORA</h1>
  <p class="home-intro">I'm a Security Engineer at Amazon working on red teaming and penetration testing. I also research vulnerabilities, build CTF challenges, and play with <a href="https://ctftime.org/team/220336" target="_blank" rel="noopener">L3ak</a>.</p>
  <p class="home-links">
    <a href="https://github.com/rach1tarora" target="_blank" rel="noopener">GitHub</a>
    <a href="https://www.linkedin.com/in/rach1tarora/" target="_blank" rel="noopener">LinkedIn</a>
    <a href="{{ '/contact' | relative_url }}">Contact</a>
  </p>
</header>

<section class="portfolio-section" aria-labelledby="home-career-heading">
  <h2 id="home-career-heading" class="section-heading">CAREER</h2>
  <div class="timeline">
    <article class="timeline-entry featured">
      <h3>Security Engineer @ <span class="company-name">Amazon</span></h3>
      <p class="entry-status">Present</p>
      <p class="timeline-description">Red teaming and penetration testing.</p>
    </article>
    <article class="timeline-entry">
      <h3>Crew @ Cloud Village</h3>
      <p class="entry-status">Present</p>
      <p class="timeline-description">Building security challenges for villages at DEF CON, RSA Conference, and BSides.</p>
    </article>
    <article class="timeline-entry">
      <h3>Azure Security Engineer Intern @ NoShitSecurity</h3>
      <p class="entry-status">Past</p>
    </article>
  </div>
  <p class="section-note"><a href="{{ '/career' | relative_url }}">View full career</a></p>
</section>

<section class="portfolio-section" aria-labelledby="home-research-heading">
  <h2 id="home-research-heading" class="section-heading">SECURITY RESEARCH</h2>
  <div class="card-grid projects-grid research-preview-grid">
    {% for cve in site.data.cves limit: 3 %}
    <article class="portfolio-card research-preview-card{% if forloop.first %} featured{% endif %}">
      <div class="cve-preview-header">
        <h3><a href="{{ cve.url }}" target="_blank" rel="noopener">{{ cve.id }}</a></h3>
        <span class="severity-badge severity-{{ cve.severity | downcase }}">{{ cve.severity }}</span>
      </div>
      <p class="cve-preview-type">{{ cve.type }} · {{ cve.cvss }}</p>
      <p>{{ cve.summary }}</p>
    </article>
    {% endfor %}
  </div>
  <p class="section-note"><a href="{{ '/security-research' | relative_url }}">View all CVEs and security research</a></p>
</section>

<section class="portfolio-section" aria-labelledby="home-certifications-heading">
  <h2 id="home-certifications-heading" class="section-heading">CERTIFICATIONS</h2>
  <div class="card-grid certification-grid">
    <article class="portfolio-card certification-card featured">
      <h3><a href="https://www.credly.com/badges/fa0dd931-f58a-4000-a9e5-48ab8e74bdd0/public_url">GCIH</a></h3>
      <p>GIAC Certified Incident Handler</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credly.com/badges/fa0dd931-f58a-4000-a9e5-48ab8e74bdd0/public_url">GSEC</a></h3>
      <p>GIAC Security Essentials</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credly.com/badges/b92a6f29-2eed-4f24-b756-930e7c88701e/public_url">GFACT</a></h3>
      <p>GIAC Foundational Cybersecurity Technologies</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credential.net/7a7f48e2-7cd8-4f6e-b7bf-c51ceb73cf9d">CRTP</a></h3>
      <p>Certified Red Team Professional</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credential.net/57148f07-f47e-497e-b34f-bb60c6ee28c3#gs.4w8fyh%5C">OSCP</a></h3>
      <p>OffSec Certified Professional</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credly.com/badges/1c258de3-a8dc-4586-b6a9-ff4d3a53c9b7">AZ-500</a></h3>
      <p>Microsoft Azure Security Engineer Associate</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credly.com/badges/5d3ea344-ecf2-4e1e-82ed-ab175733dc48">AWS CCP</a></h3>
      <p>AWS Certified Cloud Practitioner</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credly.com/badges/fcfbfadf-81a1-490a-85c0-73ed7d2cebb5">SC-100</a></h3>
      <p>Microsoft Cybersecurity Architect Expert</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://www.credly.com/badges/5b111be7-2ec8-441b-b77a-dbc61460dc7c">SC-900</a></h3>
      <p>Microsoft Security, Compliance, and Identity Fundamentals</p>
    </article>
    <article class="portfolio-card certification-card">
      <h3><a href="https://verified.elearnsecurity.com/certificates/f61e9c01-e250-4faa-99cb-869382a47ccd">eJPT</a></h3>
      <p>eLearnSecurity Junior Penetration Tester</p>
    </article>
  </div>
  <p class="section-note"><a href="{{ '/career' | relative_url }}#certifications-heading">View certification details</a></p>
</section>

<section class="portfolio-section" aria-labelledby="home-community-heading">
  <h2 id="home-community-heading" class="section-heading">CONFERENCE TALKS &amp; CTFS</h2>
  <div class="card-grid projects-grid">
    <article class="portfolio-card featured">
      <h3><a href="https://github.com/rach1tarora/infosec-talks-and-ctfs/tree/main/2025/Talks/BsidesCharm">Think You're Stealthy?</a></h3>
      <p>A BSidesCharm 2025 talk on how common Active Directory pentest tools work and how defenders can detect them.</p>
    </article>
    <article class="portfolio-card">
      <h3><a href="https://github.com/rach1tarora/infosec-talks-and-ctfs">Cloud Village CTFs</a></h3>
      <p>Security challenges built for villages at DEF CON, RSA Conference, and BSides.</p>
    </article>
    <article class="portfolio-card">
      <h3><a href="https://ctftime.org/event/2799">CTF Competitions</a></h3>
      <p>1st place with L3ak at ImaginaryCTF 2025 and 2nd place at SANS x WiCyS 2024.</p>
    </article>
  </div>
  <p class="section-note"><a href="{{ '/career' | relative_url }}#talks-heading">View talks and CTF work</a></p>
</section>

<section class="portfolio-section" aria-labelledby="home-education-heading">
  <h2 id="home-education-heading" class="section-heading">EDUCATION</h2>
  <div class="timeline education-timeline">
    <article class="timeline-entry featured">
      <h3>Master of Engineering in Cybersecurity</h3>
      <p class="entry-status">University of Maryland, College Park · 2025</p>
    </article>
    <article class="timeline-entry">
      <h3>Bachelor's Degree in Information Technology</h3>
      <p class="entry-status">Sikkim Manipal Institute of Technology · 2023</p>
    </article>
  </div>
</section>
