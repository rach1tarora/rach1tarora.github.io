---
layout: default
title: Rachit Arora
description: Security engineer working on red teaming, penetration testing, and vulnerability research.
---

<header class="home-hero">
  <h1 class="home-name">RACHIT ARORA</h1>
  <p class="home-intro">I'm a Security Engineer at Amazon working on red teaming and penetration testing. I also do independent security research, build CTF challenges, and play with <a href="https://ctftime.org/team/220336" target="_blank" rel="noopener">L3ak</a>.</p>
  <p class="home-links">
    {% include social-link.html platform="github" %}
    {% include social-link.html platform="bugcrowd" %}
    {% include social-link.html platform="linkedin" %}
    {% include social-link.html platform="x" %}
    <a href="{{ '/contact' | relative_url }}">Contact</a>
  </p>
</header>

<section class="portfolio-section" aria-labelledby="home-career-heading">
  <h2 id="home-career-heading" class="section-heading">CAREER</h2>
  <div class="timeline">
    <article class="timeline-entry featured">
      <h3>Security Engineer @ <span class="amazon-lockup" role="img" aria-label="Amazon"><span aria-hidden="true">amazon</span></span></h3>
      <p class="entry-status">Feb 2026 – Present</p>
      <p class="timeline-description">Red teaming and penetration testing.</p>
    </article>
    <article class="timeline-entry">
      <h3>Independent Security Researcher</h3>
      <p class="entry-status">Jan 2024 – Present</p>
      <p class="timeline-description">Vulnerability research and coordinated disclosure.</p>
      <p class="timeline-links">
        {% include social-link.html platform="bugcrowd" %}
        {% include social-link.html platform="github" %}
      </p>
    </article>
    <article class="timeline-entry">
      <h3>Crew @ Cloud Village</h3>
      <p class="entry-status">Jan 2024 – Present</p>
      <p class="timeline-description">Building security challenges for villages at DEF CON, RSA Conference, and BSides.</p>
    </article>
    <article class="timeline-entry">
      <h3>Security Engineer Intern @ <span class="amazon-lockup" role="img" aria-label="Amazon"><span aria-hidden="true">amazon</span></span></h3>
      <p class="entry-status">June 2025 – Aug 2025</p>
    </article>
  </div>
</section>

{% assign home_cve_count = 0 %}
{% for finding in site.data.cves %}
  {% if finding.cve_url %}{% assign home_cve_count = home_cve_count | plus: 1 %}{% endif %}
{% endfor %}
{% assign home_pending_count = site.data.cves.size | minus: home_cve_count %}

<section class="portfolio-section research-teaser" aria-labelledby="home-research-heading">
  <h2 id="home-research-heading" class="section-heading">SECURITY RESEARCH</h2>
  <p class="research-teaser-summary">{{ home_cve_count }} {% if home_cve_count == 1 %}CVE{% else %}CVEs{% endif %}{% if home_pending_count > 0 %} · {{ home_pending_count }} {% if home_pending_count == 1 %}advisory{% else %}advisories{% endif %} awaiting a CVE{% endif %}</p>
  <ul class="research-teaser-list" aria-label="Recent vulnerability disclosures">
    {% for cve in site.data.cves limit: 2 %}
    <li>
      <div class="research-teaser-identity">
        <a href="{% if cve.cve_url %}{{ cve.cve_url }}{% else %}{{ cve.url }}{% endif %}" target="_blank" rel="noopener">{{ cve.id }}</a>
        <span class="research-teaser-product">{{ cve.product | escape }}</span>
      </div>
      <span class="severity-badge severity-{{ cve.severity | downcase }}">{{ cve.severity }}</span>
    </li>
    {% endfor %}
  </ul>
  <p class="section-note"><a href="{{ '/security-research' | relative_url }}">View all research <span aria-hidden="true">→</span></a></p>
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
  </div>
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
