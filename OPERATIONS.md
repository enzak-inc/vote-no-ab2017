# OPERATIONS — vote-no-ab2017.com

Static single-page site. No build step, no backend, no database.

## Dev start

```bash
npm run serve        # python3 -m http.server 8080 → http://localhost:8080
```

Or just open `index.html` in a browser (the Census/Photon lookups still work from `file://`).

## Changing the bill's phase (the normal edit)

All phase-specific copy, targets, deadlines, timeline entries, and letter text live in **`campaign.js`**. Nothing in `index.html` is deleted between phases; components carry `data-phases="..."` / `data-target="..."` attributes and the page hides what does not apply.

1. Edit `campaign.js` → set `phase:` to one of `committee`, `floor`, `senate`, `governor`, `signed`, `vetoed`.
2. Update that phase's `statusNarrative`, `countdown`, `share`, and (for `signed` / `vetoed`) the `outcome` block. Search for `UPDATE:` markers.
3. Add timeline entries to `timeline:` (newest at the bottom). Use `kind: 'now'` for the current state and `phases: [...]` to limit an entry to some phases.
4. **Run `npm run render`.** This bakes the phase into `index.html` (status pill, countdown label, timeline, red flags, hidden components) so crawlers that do not run JavaScript (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User) see the current content. The browser JS re-applies the same values, so it is safe to run any time. Commit the result.
5. Preview before deploying: `http://localhost:8080/?phase=signed` (any phase key). Add `&debug=1` for console logs tagged `[PHASE] [LOOKUP] [LETTER] [COUNTER] [SHARE]`.
6. Bump `<lastmod>` in `sitemap.xml`, update `llms.txt` / `llms-full.txt` status lines, regenerate `og.jpg` if the headline changed.

## Full bill text page (`/ab-2017-bill-text/`)

- `ab-2017-bill-text/index.html` and the Markdown twin `ab-2017-bill-text.md` are generated from the official text on leginfo.legislature.ca.gov (bill_id `202520260AB2017`).
- To refresh after a new amendment or chaptering: save the leginfo bill-text page HTML, run the converter (`bill_to_html.py` then `assemble_fulltext.py`, kept in the session scratchpad; copy them into `scripts/` if this becomes routine), update the "This version" meta line, the "What changed" section, and `lastmod` in `sitemap.xml`.
- The `.md` file is served as `text/markdown` via `_headers`.

## SEO checks

- `npm run pagespeed` — Core Web Vitals via Google PageSpeed Insights for `/` (add paths as extra args, e.g. `npm run pagespeed -- https://vote-no-ab2017.com / /ab-2017-bill-text/`).
- OG images: `og.jpg` + `og-4x3.jpg` + `og-square.jpg` (home) and `og-full-text*.jpg` (bill page) are referenced in the JSON-LD `image` arrays. Regenerate with the `make_og_set.py` recipe (Pillow + Playfair/Inter TTFs) when the headline changes.
- Google Search Console: the site is not yet a verified property on the enzak account. Add it (DNS TXT via Cloudflare) and submit `https://vote-no-ab2017.com/sitemap.xml`.

To reuse the site for a different bill: change `bill:`, `governor:`, `timeline:`, `stages:`, `provisions:`, `redFlags:`, `letters:`, and `polishPrompt:` in `campaign.js`; update the static copy in `index.html` (title, meta, About section, JSON-LD, FAQ); update the rosters if the session changed.

## Deploy (Cloudflare Pages)

- Project: `vote-no-ab2017` (Cloudflare account `a12a9cc268038a4a78487bf60d453182`). Build command: none. Output directory: `/`.
- **Push to `main` → Cloudflare Pages auto-deploys** in about 30 seconds. There is no staging environment; preview locally first.
- `_headers` (CSP, HSTS, Content-Signal) and `_redirects` (www → apex) are applied automatically by Pages.
- Cloudflare "Email Address Obfuscation" is ON for the zone: it rewrites `mailto:` links and injects `/cdn-cgi/scripts/.../email-decode.min.js`. Harmless under the current CSP (`script-src 'self'`). Turn it off in Cloudflare → Scrape Shield if it ever breaks a mailto link.

After a content change:

```bash
npm run indexnow     # pushes sitemap URLs to Bing/Yandex/Seznam/Naver (uses .env or defaults)
```

## Verify after deploy

- https://vote-no-ab2017.com/ loads, hero countdown shows the current deadline, status pill matches `campaign.js`.
- https://vote-no-ab2017.com/campaign.js returns JavaScript (CSP `script-src 'self'` allows it).
- `?phase=signed` and `?phase=vetoed` render the outcome banner and hide the form.
- View source → JSON-LD `Legislation` block matches the current status.

## Environment

- The live site uses no environment variables.
- `scripts/ping-indexnow.mjs` reads `INDEXNOW_KEY` and `SITE_URL` from `.env` (template in `.env.example`).

## Dependencies

- None to install. `package.json` has only npm scripts.
- External runtime services: U.S. Census Geocoder (district lookup, JSONP), Photon by komoot (address autocomplete), abacus.jasoncameron.dev (anonymous counters, namespace `voteno-ab2017-v2`, keys `visits`, `emails`, `letters`, `calls`).

## Common issues

- **Countdown shows zeros / stale status:** `campaign.js` `phase` or `countdown.iso` was not updated. Past deadlines show the phase's `expiredText`.
- **A component is missing:** check its `data-phases` / `data-target` attribute against the active phase's `target` (`legislators`, `governor`, `none`).
- **Census lookup fails:** the geocoder is JSONP; the CSP `script-src` must keep `https://geocoding.geo.census.gov`.
- **Counters read 0:** abacus namespace/key mismatch, or the service is down; failures are non-blocking.
- **Governor form button does nothing:** it is a normal link to gov.ca.gov/contact; popup blockers do not apply. The clipboard copy needs HTTPS or localhost.
