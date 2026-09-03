#!/usr/bin/env node
/**
 * Run Google PageSpeed Insights against the homepage + key pages.
 * Reports LCP / INP / CLS + mobile/desktop scores. Exits non-zero if any score
 * < 80 or any Core Web Vital fails (LCP > 2.5s, INP > 200ms, CLS > 0.1).
 *
 * Usage:
 *   node scripts/pagespeed-check.mjs                          # SITE_URL from .env, homepage only
 *   node scripts/pagespeed-check.mjs https://vote-no-ab2017.com / /ab-2017-full-text/
 *
 * Env (optional): PAGESPEED_API_KEY=AIza...   SITE_URL=https://vote-no-ab2017.com
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  for (const rel of ['.env.local', '.env']) {
    const path = resolve(process.cwd(), rel);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
}
loadEnv();

const args = process.argv.slice(2);
const site = args.find((a) => a.startsWith('http')) || process.env.SITE_URL || 'https://vote-no-ab2017.com';
const paths = args.filter((a) => a.startsWith('/'));
const urls = (paths.length ? paths : ['/']).map((p) => site.replace(/\/$/, '') + p);
const apiKey = process.env.PAGESPEED_API_KEY ?? '';
const T = { performance: 80, lcp: 2500, inp: 200, cls: 0.1 };

async function pagespeed(url, strategy) {
  const params = new URLSearchParams({ url, strategy, category: 'performance' });
  if (apiKey) params.set('key', apiKey);
  const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`);
  if (!res.ok) throw new Error(`PSI HTTP ${res.status} for ${url} (${strategy})`);
  const data = await res.json();
  const lh = data.lighthouseResult ?? {};
  const a = lh.audits ?? {};
  return {
    url, strategy,
    score: (lh.categories?.performance?.score ?? 0) * 100,
    lcp: a['largest-contentful-paint']?.numericValue,
    inp: a['interaction-to-next-paint']?.numericValue,
    cls: a['cumulative-layout-shift']?.numericValue,
  };
}
const ok = (b) => (b ? '✓' : '✗');

let failed = false;
console.log(`\nGoogle PageSpeed Insights — ${urls.length} URL(s)\n`);
for (const url of urls) {
  for (const strategy of ['mobile', 'desktop']) {
    try {
      const r = await pagespeed(url, strategy);
      const p = r.score >= T.performance, l = !r.lcp || r.lcp <= T.lcp, i = !r.inp || r.inp <= T.inp, c = r.cls == null || r.cls <= T.cls;
      const pass = p && l && i && c;
      if (!pass) failed = true;
      console.log(`  ${ok(pass)} ${strategy.padEnd(7)} ${r.url}\n    score=${r.score.toFixed(0).padStart(3)}/100  LCP=${r.lcp ? (r.lcp / 1000).toFixed(2) + 's' : '?'} ${ok(l)}  INP=${r.inp ? r.inp.toFixed(0) + 'ms' : '?'} ${ok(i)}  CLS=${r.cls != null ? r.cls.toFixed(3) : '?'} ${ok(c)}`);
    } catch (e) {
      console.error(`  ✗ ${strategy.padEnd(7)} ${url}\n    ERROR ${e.message}`);
      failed = true;
    }
  }
}
console.log(failed ? '\n✗ One or more URLs/strategies failed thresholds.' : '\n✓ All URLs passed thresholds.');
process.exit(failed ? 1 : 0);
