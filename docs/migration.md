# GitHub Pages migration — 16 November 2026

The approved Astro website in the VS Code workspace replaces the previous HTML/Jekyll website in [xboxlivejohns/PP](https://github.com/xboxlivejohns/PP). Its design, copy, published media, service prices and enquiry flow are preserved. Only hosting configuration, legacy URL compatibility and the 404 canonical URL were adapted.

## Recovery points

- Old published commit: `0a67cd54e6659af0b475f1bea5bd189b6b98c221`.
- Remote backup branch: [`backup/live-before-workspace-migration-20261116`](https://github.com/xboxlivejohns/PP/tree/backup/live-before-workspace-migration-20261116).
- Annotated remote tag: [`live-before-workspace-migration-20261116`](https://github.com/xboxlivejohns/PP/releases/tag/live-before-workspace-migration-20261116).
- Original workspace snapshot: local branch `workspace-before-migration-20261116`, commit `ec05146`.
- Local Git bundle: `C:/Projects/PP-workspace-before-migration-20261116.bundle`, containing the original workspace and old main history. The original media library and local caches remain untouched and unpublished.

The workspace originally had no Git metadata. It was initialized without checking out or overwriting its files. The replacement commit is a normal descendant of old `main`; no force push or history rewrite is used. Old pages, vendor files, media, root CSS/JavaScript, prototype documentation and Jekyll configuration are removed from the production branch. Historical versions remain recoverable through Git.

## Hosting and domains

[The deployment workflow](../.github/workflows/deploy.yml) uses Node 24, `npm ci`, a production build, [generated-site validation](../tools/check-built-site.mjs), and Chrome/Playwright tests before publishing only `dist/` through official GitHub Pages actions. Documentation-only changes do not deploy. GitHub Pages remains the free host; no backend or paid service is added.

[CNAME](../public/CNAME), [Astro site configuration](../astro.config.mjs), [robots](../public/robots.txt), [sitemap](../src/pages/sitemap.xml.ts), canonical URLs, Open Graph URLs and social images use `https://polishedpristinedetailing.co.uk/`. Asset paths start at `/`, with no `/PP/` prefix. The generated custom 404 page is noindex.

Initial Pages settings were legacy deployment from `main` `/`, custom domain `polishedpristinedetailing.co.uk`, HTTPS enforced and an approved certificate covering both the apex and `www`. DNS already points to GitHub's four Pages IPv4 addresses; `www` points to `xboxlivejohns.github.io`. Keep these DNS records. Deployment changes Pages to GitHub Actions while retaining the domain and HTTPS.

## Existing customer links

Current routes `/`, `/services/`, `/gallery/`, `/booking/` and `/ceramic-coating/` remain unchanged. [The compatibility manifest](../src/data/legacy-redirects.js) generates 22 static HTML redirect files, including:

| Historical URL                                | Replacement                    |
| --------------------------------------------- | ------------------------------ |
| `/services.html`                              | `/services/`                   |
| `/portfolio.html`, `/portfolio/`              | `/gallery/`                    |
| `/booking.html`, `/contact.html`, `/contact/` | `/booking/`                    |
| `/maintenance/`                               | `/valeting/#maintenance-plans` |
| `/paint-enhancement/`                         | `/paint-correction/`           |
| `/protection/`                                | `/ceramic-coating/`            |
| `/protection/#ppf`                            | `/services/#ppf`               |

Queries and relevant fragments are retained. Existing service IDs and renamed group anchors, home `#services-intro`, coating `#real-results`, and `#top` remain usable. Existing `/index.html` URLs serve the new compiled pages directly. Redirects provide canonical URLs, noindex, an HTML refresh and a visible fallback link; GitHub Pages cannot implement arbitrary HTTP 301 rules. Without JavaScript, the HTML fallback uses the default destination; fragment-specific routing requires JavaScript.

## Enquiries

The website validates and prepares a message locally, then the customer chooses WhatsApp or email to send it. There is no website inbox, server submission, automatic booking, payment collection or stored enquiry data. Direct links also work without JavaScript. The approved call number `07776 732135` and separate WhatsApp number `07468 286651` are retained. Tests prepare messages without sending them. Real phone calls, delivered messages, confirmed booking availability and payments are not exercised.

## Verification record

Production output is checked before deployment for all current pages, local links and fragments, responsive image sources, fonts, videos, canonical/social metadata, the exact sitemap, robots, domain files, custom 404, and absence of obsolete published files. Browser checks cover mobile, tablet, landscape and desktop layouts, axe accessibility, navigation and keyboard controls, prices/inclusions, gallery filtering/history/lightbox, video behavior, reduced motion, no-JavaScript fallbacks, Google map consent, and enquiry generation.

Live deployment and verification evidence will be recorded here once deployment finishes.

Pre-deployment verification passed on 16 November 2026: production build; generated-site validation of 11 indexable pages, 34 HTML files, 1,188 local references and 254 published files; all 30 Chrome/Playwright tests; and VS Code diagnostics. The compiled homepage was visually inspected at 390 px and 1,440 px. No design, copy, approved service data, CSS, images or package-lock changes were made. Initial fragment navigation was corrected because startup animation refreshes could cancel native section scrolling.

## Rollback without force pushing

Use a fresh clone or clean working branch. Restore the old tagged tree as a **new commit**, review it, and push normally. For example, `git restore --source=live-before-workspace-migration-20261116 --staged --worktree -- .` followed by a normal commit restores tracked website files without rewriting history; run this only in a clean checkout so unrelated local work is protected. Then set Pages back to **Deploy from a branch**, branch `main`, folder `/`, retaining the custom domain and HTTPS. The old tree includes its original CNAME and Jekyll configuration. Never reset or force-push `main` to roll back.
