(() => {
    'use strict';

    const page = document.querySelector('[data-research-page]');
    if (!page) return;

    const form = page.querySelector('#research-filters');
    const search = page.querySelector('#research-search');
    const severity = page.querySelector('#research-severity');
    const year = page.querySelector('#research-year');
    const list = page.querySelector('#research-list');
    const counter = page.querySelector('#research-count');
    const empty = page.querySelector('#research-empty');
    const scrollHint = page.querySelector('#research-scroll-hint');
    const resetButtons = [...page.querySelectorAll('[data-research-reset]')];
    const findings = [...list.querySelectorAll('[data-finding]')].map(element => ({
        element,
        text: element.textContent.toLowerCase(),
        severity: element.dataset.severity,
        year: element.dataset.year
    }));

    function filterFindings() {
        const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
        let count = 0;

        findings.forEach(finding => {
            const matches = terms.every(term => finding.text.includes(term)) &&
                (!severity.value || finding.severity === severity.value) &&
                (!year.value || finding.year === year.value);
            finding.element.hidden = !matches;
            if (matches) count += 1;
        });

        const filtered = terms.length > 0 || Boolean(severity.value) || Boolean(year.value);
        counter.textContent = filtered
            ? `${count} of ${findings.length} findings`
            : `${count} ${count === 1 ? 'finding' : 'findings'}`;
        empty.hidden = count !== 0;
        scrollHint.hidden = count === 0;
        resetButtons.forEach(button => { button.disabled = !filtered; });
        list.scrollTop = 0;
    }

    form.addEventListener('submit', event => event.preventDefault());
    search.addEventListener('input', filterFindings);
    severity.addEventListener('change', filterFindings);
    year.addEventListener('change', filterFindings);
    resetButtons.forEach(button => {
        button.addEventListener('click', () => {
            form.reset();
            filterFindings();
            search.focus();
        });
    });

    filterFindings();
    form.hidden = false;
})();
