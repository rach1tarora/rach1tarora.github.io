---
layout: default
title: Security Research
description: Published CVEs, vulnerability research, security tooling, talks, and CTF development by Rachit Arora.
permalink: /security-research
---

<header class="page-intro">
  <h1>SECURITY RESEARCH</h1>
  <p>CVEs I have reported, security projects I work on, and talks and CTFs I have helped create.</p>
</header>

<section class="portfolio-section" aria-labelledby="published-vulnerabilities-heading">
<h2 id="published-vulnerabilities-heading" class="section-heading">PUBLISHED VULNERABILITIES</h2>

<p class="cve-list-note">{{ site.data.cves | size }} published findings · scroll to view all</p>

<div class="severity-legend" aria-label="Severity color guide">
  <span class="severity-badge severity-critical">Critical</span>
  <span class="severity-badge severity-high">High</span>
  <span class="severity-badge severity-medium">Medium</span>
  <span class="severity-badge severity-low">Low</span>
</div>

<div class="cve-list" tabindex="0" aria-label="Published vulnerabilities">
{% for cve in site.data.cves %}
  <article class="cve-entry">
    <div class="cve-entry-header">
      <a href="{{ cve.url }}" target="_blank" rel="noopener"><strong>{{ cve.id }}</strong></a>
      <a class="severity-badge severity-{{ cve.severity | downcase }}" href="{{ cve.metrics_url }}" target="_blank" rel="noopener" aria-label="{{ cve.severity }} severity, {{ cve.cvss_version }} score {{ cve.cvss }}">{{ cve.severity }} · {{ cve.cvss }}</a>
    </div>
    <p><strong>{{ cve.type }}</strong></p>
    <p>{{ cve.product }}</p>
    <p>{{ cve.summary }}</p>
    <div class="cve-entry-footer">
      <span>Affected: {{ cve.affected }}</span>
      <span>{{ cve.cvss_version }} · {{ cve.score_source }}</span>
    </div>
    <div class="cve-entry-links">
      <a href="{{ cve.url }}" target="_blank" rel="noopener">Advisory</a>
      {% if cve.repo_url %}<a href="{{ cve.repo_url }}" target="_blank" rel="noopener">GitHub repository</a>{% endif %}
      {% if cve.cve_url %}<a href="{{ cve.cve_url }}" target="_blank" rel="noopener">CVE record</a>{% else %}<span class="cve-pending">CVE pending</span>{% endif %}
    </div>
  </article>
{% endfor %}
</div>
</section>

<section class="portfolio-section" aria-labelledby="security-projects-heading">
  <h2 id="security-projects-heading" class="section-heading">SECURITY PROJECTS</h2>
  <div class="card-grid projects-grid">
    <article class="portfolio-card featured">
      <h3><a href="https://github.com/rach1tarora/offensive-coding" target="_blank" rel="noopener">Offensive Coding</a></h3>
      <p>Security projects and code for Windows, Linux, shellcoding, and Python.</p>
    </article>
    <article class="portfolio-card">
      <h3><a href="https://github.com/rach1tarora/infosec-talks-and-ctfs/tree/main/2025/Talks/BsidesCharm" target="_blank" rel="noopener">Active Directory Attack Detection</a></h3>
      <p>Research on common AD pentest tools, the artifacts they leave behind, and how defenders can detect them.</p>
    </article>
  </div>
</section>

<section class="portfolio-section" aria-labelledby="talks-ctfs-heading">
  <h2 id="talks-ctfs-heading" class="section-heading">TALKS &amp; CTFS</h2>
  <div class="card-grid projects-grid">
    <article class="portfolio-card featured">
      <h3><a href="https://github.com/rach1tarora/infosec-talks-and-ctfs/tree/main/2025/Talks/BsidesCharm" target="_blank" rel="noopener">Think You're Stealthy?</a></h3>
      <p>A BSidesCharm 2025 talk on the artifacts left by common Active Directory pentest tools.</p>
    </article>
    <article class="portfolio-card">
      <h3><a href="https://github.com/rach1tarora/infosec-talks-and-ctfs" target="_blank" rel="noopener">CTFs with Cloud Village</a></h3>
      <p>Security challenges built for conferences including DEF CON, RSA Conference, and BSides.</p>
    </article>
  </div>
</section>
