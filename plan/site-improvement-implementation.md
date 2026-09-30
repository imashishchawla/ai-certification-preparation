# Certification Prep website implementation plan

## Product direction

The homepage title is **Certification Prep — Practice Library**. The site presents study guides, practice questions, exam notes, and timed mock tests as one place to prepare for professional certifications. It makes no offline-use promise.

The directory has two sections:

1. **Active certifications:** verified exam identity, visible provider brand name, published question count, working study and practice actions.
2. **In development:** onboarding and planned tracks together. Onboarding tracks link to available official exam information. Planned subjects do not display speculative exam names, fees, scores, or dates.

Brand names are used in cards. Official logos may be added only when a suitable asset and its usage terms are confirmed.

## Delivery sequence

1. **Publishing and SEO:** normalize analytics variables before Hugo reads them, build and audit the artifact, then verify the public site after deployment. Check titles, descriptions, canonical URLs, social preview tags, schema, sitemap, and internal links.
2. **Catalog truth:** derive public counts from publishable questions and keep proposed track targets out of totals. Remove unsupported structured-data claims and noindex thin placeholder pages.
3. **Visitor journey:** use the shared directory layout on the homepage and catalog. Keep the active track prominent and provide direct paths to domain study, question practice, and the mock test.
4. **Accessibility:** provide a skip link, visible focus, responsive cards, labeled filters, status announcements, and focus movement when mock-test screens change.
5. **Reusable exam flow:** pass exam identity and settings from the track into the browser UI; publish per-exam question artifacts only when status permits. Preserve the existing curator and release gates.
6. **Onboarding verification:** compare each track with the certification provider's current exam page, record the source and check date, reconcile objectives and price, and keep practice disabled until the question bank meets its release threshold.

## Terraform Associate (004) gate

HashiCorp's [certification page](https://developer.hashicorp.com/certifications/infrastructure-automation) confirms version 004, Terraform 1.12, a one-hour online proctored exam, and a listed price of $70.50 USD plus applicable taxes and fees (checked 2026-09-30). Its current objective list replaces older domain labels and unverified weights. The site must not claim an official passing score. The local question bank currently contains zero questions, so Terraform remains **In preparation** and its practice and mock-test UI remain disabled.

## Acceptance checks

- Hugo builds with a bare Cloudflare token, a Cloudflare snippet, or no analytics variable.
- The generated homepage count equals its published CCAF question artifact; Terraform publishes no questions while onboarding.
- Planned and empty onboarding pages are noindex and absent from the sitemap.
- The local SEO, link, and rendered-page audits pass.
- The desktop and mobile directory, filtered practice, answer reveal, and timed mock test work in a separate browser session.
- A GitHub Pages deployment is considered complete only after the live-site check passes.
