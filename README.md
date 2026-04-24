# Vote NO on AB 2017

> A free, privacy-respecting civic action tool for California residents to contact their state legislators about **AB 2017** — a bill that would formally recognize Eid al-Fitr and Eid al-Adha as California state holidays.

**Live site:** https://vote-no-ab2017.com

**Status:** Static HTML page. No backend. No database. No tracking. No accounts.

---

## What the tool does

1. Collects the user's CA street address (with free OpenStreetMap autocomplete).
2. Calls the **U.S. Census Geocoder** (free, no API key) to find the user's Assembly District (1–80) and State Senate District (1–40).
3. Matches the district numbers to the embedded CA legislator roster (80 Assembly Members + 40 State Senators, 2025-2026 session, with verified emails).
4. Requires a 50+ character personal reason in the user's own words.
5. Optionally opens **ChatGPT** in a new tab with a pre-filled prompt to polish the draft.
6. Opens the user's default mail app via `mailto:` with the Assembly Member, State Senator, and bill author (Asm. Matt Haney) in the To: line, subject and body pre-filled.

Follows research-backed advocacy best practices from the Congressional Management Foundation, Quorum, and the ACLU — constituent-verified, personalized, targeted. No mass BCC blasts.

---

## Privacy

**Zero data collected.** No cookies. No analytics. No server-side anything.

The only outside requests are:
- `geocoding.geo.census.gov` — U.S. Census Geocoder (district lookup from address)
- `photon.komoot.io` — OpenStreetMap address autocomplete
- `abacus.jasoncameron.dev` — shared integer page-visit + emails-prepared counters

None of them correlate with identity. None of them see the user's name or email body. All drafting stays in the browser.

---

## Project structure

```
.
├── index.html                        # everything — HTML, CSS, JS all inline
├── img/
│   └── california-state-capitol-ab-2017-civic-action.jpg  # hero (OpenAI gpt-image-2)
├── favicon.svg                       # American flag (scales to all sizes)
├── favicon-96x96.png                 # Google-compliant 96×96 (multiple of 48)
├── apple-touch-icon.png              # 180×180 iOS home-screen
├── icon-192.png                      # PWA manifest icon
├── icon-512.png                      # PWA manifest icon
├── site.webmanifest                  # PWA manifest
├── robots.txt                        # AI bot allowlist + training blocklist
├── sitemap.xml                       # single-page sitemap
├── llms.txt                          # AI-agent content index (concise)
├── llms-full.txt                     # AI-agent full content (expanded)
├── _headers                          # Cloudflare Pages / Netlify HTTP headers (CSP, HSTS, Content-Signal, etc.)
├── _redirects                        # www → apex 301
├── 2214d96ae1e64276a5df170ad2ae1e24.txt  # IndexNow key file
├── scripts/
│   └── ping-indexnow.mjs             # submit sitemap URLs to Bing/Yandex/Seznam/Naver
├── package.json                      # holds the npm indexnow script
├── .env.example                      # IndexNow env vars
└── .gitignore
```

---

## Deployment — Cloudflare Pages

This site is designed for **Cloudflare Pages**. Steps:

### 1. Connect the GitHub repo

1. Log in to Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select the `vote-no-ab2017` GitHub repo.
3. Build settings:
   - **Build command:** *(leave empty — static site)*
   - **Output directory:** `/` *(project root)*
4. Click **Save and Deploy**. Cloudflare will publish a preview URL in ~30 seconds.

### 2. Attach the custom domain

1. In the Pages project → **Custom domains** → **Set up a custom domain**.
2. Enter `vote-no-ab2017.com` → Cloudflare auto-creates the DNS record if the domain is already on Cloudflare.
3. Also add `www.vote-no-ab2017.com` as a second custom domain — the `_redirects` file in this repo will 301 it to the apex.

### 3. `_headers` and `_redirects` take effect automatically

Cloudflare Pages natively reads both files from the project root. No extra config required.

### 4. Verify after deploy

- Visit https://vote-no-ab2017.com → page loads, hero image shows, form is interactive
- Visit https://vote-no-ab2017.com/robots.txt → plain-text robots with AI directives
- Visit https://vote-no-ab2017.com/llms.txt → concise content index for AI agents
- Visit https://vote-no-ab2017.com/llms-full.txt → expanded content for AI agents
- Visit https://vote-no-ab2017.com/sitemap.xml → single-URL sitemap
- Visit https://vote-no-ab2017.com/2214d96ae1e64276a5df170ad2ae1e24.txt → IndexNow key (body should be exactly the filename without extension)
- Inspect response headers for `Content-Security-Policy`, `Strict-Transport-Security`, `Content-Signal`, and the `Link: </llms.txt>; rel="llms-txt"` header
- Visit https://www.vote-no-ab2017.com → should 301 to apex

### 5. Push the sitemap to Bing/Yandex/Seznam/Naver via IndexNow

Once deployed:

```bash
npm run indexnow
```

(or `INDEXNOW_KEY=... SITE_URL=https://vote-no-ab2017.com node scripts/ping-indexnow.mjs`)

Expected output: `[indexnow] ✓ submitted successfully`.

### 6. Add the site to Google Search Console + Bing Webmaster Tools

Currently the verification meta tags in `index.html` are commented out:

```html
<!-- <meta name="google-site-verification" content="REPLACE_WITH_GSC_TOKEN" /> -->
<!-- <meta name="msvalidate.01" content="REPLACE_WITH_BING_TOKEN" /> -->
<!-- <meta name="yandex-verification" content="REPLACE_WITH_YANDEX_TOKEN" /> -->
```

After deploying:
1. Register the site at https://search.google.com/search-console → copy the HTML tag token → uncomment the Google line and paste the token.
2. Register at https://www.bing.com/webmasters → same for Bing.
3. Register at https://webmaster.yandex.com → same for Yandex.
4. Commit and push — tokens take effect within minutes.
5. In each webmaster tool, submit `https://vote-no-ab2017.com/sitemap.xml`.

---

## Development

```bash
# Local preview
npm run serve   # starts python -m http.server on 8080
# or just: open index.html in a browser
```

No build step. Edit `index.html` directly.

---

## License

CC0 — public domain. Copy, fork, remix, deploy. Attribution appreciated but not required.

## Credits

- Hero image: OpenAI `gpt-image-2` (2026-04-21)
- Roster: assembly.ca.gov + senate.ca.gov
- Bill data: leginfo.legislature.ca.gov
- Advocacy research: Congressional Management Foundation, Quorum, ACLU

Built by the people, for the people — as a free tool to help stop AB 2017.
