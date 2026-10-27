---
layout: default
title: Security Research
description: Vulnerabilities found and reported by Rachit Arora, with public advisories, CVE records, and severity details.
permalink: /security-research
stylesheets:
  - /assets/research.css
---

{% assign total_findings = site.data.cves | size %}
{% assign assigned_cves = 0 %}
{% for finding in site.data.cves %}
  {% if finding.cve_url %}{% assign assigned_cves = assigned_cves | plus: 1 %}{% endif %}
{% endfor %}
{% assign pending_cves = total_findings | minus: assigned_cves %}
{% assign years = site.data.cves | map: 'year' | uniq | sort | reverse %}

<div class="research-page" data-research-page>
  <header class="research-intro">
    <h1>Security Research</h1>
    <p>Vulnerabilities I've found and reported. Browse the findings below for their impact, affected versions, and public advisories.</p>
    <div class="research-profile-links">
      {% include social-link.html platform="bugcrowd" arrow=true %}
      {% include social-link.html platform="github" arrow=true %}
    </div>
  </header>

  <dl class="research-stats" aria-label="Research overview">
    <div><dt>Published findings</dt><dd>{{ total_findings }}</dd></div>
    <div><dt>Assigned CVEs</dt><dd>{{ assigned_cves }}</dd></div>
    <div><dt>Awaiting a CVE</dt><dd>{{ pending_cves }}</dd></div>
  </dl>

  <section class="research-findings" aria-labelledby="published-cves">
    <h2 id="published-cves">Published findings</h2>
    <form class="research-filters" id="research-filters" role="search" aria-label="Filter published findings" hidden>
      <div class="research-field research-search-field">
        <label for="research-search">Search findings</label>
        <input type="search" id="research-search" name="q" placeholder="CVE, product, or vulnerability…" autocomplete="off" aria-controls="research-list">
      </div>
      <div class="research-field research-severity-field">
        <label for="research-severity">Severity</label>
        <select id="research-severity" name="severity" aria-controls="research-list">
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium / Moderate</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div class="research-field">
        <label for="research-year">Year</label>
        <select id="research-year" name="year" aria-controls="research-list">
          <option value="">All years</option>
          {% for year in years %}<option value="{{ year }}">{{ year }}</option>{% endfor %}
        </select>
      </div>
      <button class="research-reset" type="button" data-research-reset>Reset</button>
    </form>

    <div class="research-list-meta">
      <p id="research-count" role="status" aria-live="polite" aria-atomic="true">{{ total_findings }} findings</p>
      <p id="research-scroll-hint">Scroll the list to browse</p>
    </div>

    <div class="research-list" id="research-list" role="region" tabindex="0" aria-label="Published vulnerability findings" aria-describedby="research-scroll-hint">
      {% for cve in site.data.cves %}
      {% assign severity_group = cve.severity | downcase | replace: 'moderate', 'medium' %}
      {% assign finding_id = cve.id | slugify %}
      <article class="research-finding" id="{{ finding_id }}" data-finding data-severity="{{ severity_group }}" data-year="{{ cve.year }}" aria-labelledby="{{ finding_id }}-title">
        <div class="research-finding-heading">
          <div>
            <p class="research-finding-id"><a href="{{ cve.url }}" target="_blank" rel="noopener">{{ cve.id }}</a><span>{{ cve.year }}</span></p>
            <h3 id="{{ finding_id }}-title">{{ cve.product | escape }}</h3>
          </div>
          <a class="research-severity severity-{{ cve.severity | downcase }}" href="{{ cve.metrics_url }}" target="_blank" rel="noopener" aria-label="{{ cve.severity }} severity, {{ cve.cvss_version }} score {{ cve.cvss }} out of 10">{{ cve.severity }} <span>{{ cve.cvss }}</span></a>
        </div>
        <p class="research-finding-type">{{ cve.type | escape }}{% unless cve.cve_url %}<span class="research-pending">CVE pending</span>{% endunless %}</p>
        <p class="research-finding-summary">{{ cve.summary | escape }}</p>

        <div class="research-finding-links">
          <a href="{{ cve.url }}" target="_blank" rel="noopener">Read advisory <span aria-hidden="true">↗</span></a>
          {% if cve.cve_url %}<a href="{{ cve.cve_url }}" target="_blank" rel="noopener">CVE.org record <span aria-hidden="true">↗</span></a>{% endif %}
          {% if cve.repo_url %}<a href="{{ cve.repo_url }}" target="_blank" rel="noopener">Repository <span aria-hidden="true">↗</span></a>{% endif %}
        </div>
        <details class="research-details">
          <summary>Versions &amp; scoring</summary>
          <dl>
            <div><dt>Affected versions</dt><dd>{{ cve.affected | escape }}</dd></div>
            <div><dt>Severity source</dt><dd><a href="{{ cve.metrics_url }}" target="_blank" rel="noopener">{{ cve.score_source }} · {{ cve.cvss_version }} · {{ cve.cvss }}/10</a></dd></div>
          </dl>
        </details>
      </article>
      {% endfor %}
      <div class="research-empty" id="research-empty" hidden>
        <h3>No matching findings</h3>
        <p>Try another search or clear the filters.</p>
        <button class="research-reset" type="button" data-research-reset>Clear filters</button>
      </div>
    </div>
  </section>
</div>

<script src="{{ '/assets/research.js' | relative_url }}" defer></script>
