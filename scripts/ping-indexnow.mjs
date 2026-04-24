#!/usr/bin/env node

/**
 * IndexNow URL submission script — Vote NO on AB 2017
 *
 * Pushes the sitemap URLs to Bing, Yandex, Seznam, Naver via the IndexNow API.
 *
 * Usage:
 *   INDEXNOW_KEY=... SITE_URL=https://vote-no-ab2017.com node scripts/ping-indexnow.mjs
 *   # or (if sitemap.xml lives at SITE_URL/sitemap.xml)
 *   node scripts/ping-indexnow.mjs https://vote-no-ab2017.com/
 *
 * Env:
 *   INDEXNOW_KEY  — 8-128 hex key (must match /<key>.txt file served from site root)
 *   SITE_URL      — canonical https origin (no trailing slash needed)
 *
 * Ref: https://www.indexnow.org/
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const KEY = process.env.INDEXNOW_KEY || '2214d96ae1e64276a5df170ad2ae1e24';
const SITE_URL = (process.env.SITE_URL || process.argv[2] || 'https://vote-no-ab2017.com').replace(/\/$/, '');

if (!KEY || KEY.length < 8) {
  console.error('Missing or too-short INDEXNOW_KEY (must be 8-128 hex chars).');
  process.exit(1);
}

const host = new URL(SITE_URL).host;
const keyLocation = `${SITE_URL}/${KEY}.txt`;

// Build URL list — for a single-page site, start with the homepage.
// If you add additional pages later, read sitemap.xml and extract <loc> entries.
const urlList = [
  `${SITE_URL}/`,
];

// Try to parse sitemap.xml for any additional URLs (graceful fallback if missing)
try {
  const sitemapPath = resolve(__dirname, '..', 'sitemap.xml');
  const xml = readFileSync(sitemapPath, 'utf-8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  for (const url of matches) {
    if (!urlList.includes(url)) urlList.push(url);
  }
} catch (_) {
  /* no sitemap, carry on */
}

console.log(`[indexnow] host: ${host}`);
console.log(`[indexnow] key:  ${KEY.slice(0, 4)}...${KEY.slice(-4)}`);
console.log(`[indexnow] urls: ${urlList.length}`);
urlList.forEach(u => console.log(`   - ${u}`));

const payload = {
  host,
  key: KEY,
  keyLocation,
  urlList,
};

const endpoint = 'https://api.indexnow.org/indexnow';

try {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'User-Agent': 'vote-no-ab2017.com IndexNow pinger',
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  console.log(`[indexnow] response: ${response.status} ${response.statusText}`);
  if (text) console.log(`[indexnow] body: ${text}`);

  if (response.ok || response.status === 202) {
    console.log('[indexnow] \u2713 submitted successfully');
    process.exit(0);
  } else {
    console.error('[indexnow] \u2717 submission failed');
    process.exit(1);
  }
} catch (err) {
  console.error('[indexnow] request error:', err.message);
  process.exit(1);
}
