#!/usr/bin/env node
/**
 * render-static.mjs — bake the current phase from campaign.js into index.html.
 *
 * Why: AI crawlers (GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User) do not run
 * JavaScript. Everything the page fills from campaign.js at runtime (status
 * pill, countdown label, timeline, red flags, which components are hidden) must
 * already be in the HTML for them to see it. This script writes it in; the
 * browser JS then re-applies the same values (idempotent), so ?phase= previews
 * still work.
 *
 * Run after every campaign.js edit:   npm run render
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
// package.json is "type": "module", so plain .js files load as ESM here; both
// files also attach themselves to the global object, which is what we read.
globalThis.window = globalThis;
require(resolve(ROOT, 'campaign.js'));
require(resolve(ROOT, 'campaign-render.js'));
const CAMPAIGN = globalThis.CAMPAIGN;
const R = globalThis.CAMPAIGN_RENDER;
if (!CAMPAIGN || !R) { console.error('render-static: campaign.js / campaign-render.js did not load'); process.exit(1); }
const PHASE_KEY = CAMPAIGN.phase;
const PHASE = CAMPAIGN.phases[PHASE_KEY];
if (!PHASE) { console.error(`render-static: unknown phase "${PHASE_KEY}"`); process.exit(1); }
const TARGET = PHASE.target || 'legislators';

const file = resolve(ROOT, 'index.html');
let html = readFileSync(file, 'utf8');
const before = html;
let changes = 0;

function replaceBetween(marker, content) {
  const re = new RegExp(`(<!-- static:${marker} -->)[\\s\\S]*?(<!-- /static:${marker} -->)`);
  if (!re.test(html)) { console.warn(`render-static: marker "${marker}" not found`); return; }
  // replacer FUNCTION, not a string: content like "$137.6 million" contains "$1",
  // which String.replace would otherwise treat as a backreference.
  html = html.replace(re, (m, open, close) => open + content + close);
  changes++;
}

function fillFrom(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

// 1. data-fill elements (span/p/h2/h3/a/button/div) — content has no nested same-tag closers
html = html.replace(/<(span|p|h2|h3|a|button|div)([^>]*\sdata-fill="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g, (m, tag, attrs, key, inner) => {
  const v = fillFrom(PHASE, key);
  if (v == null) return m;
  changes++;
  return `<${tag}${attrs}>${v}</${tag}>`;
});

// 2. hidden attribute for data-phases / data-target
html = html.replace(/<([a-z0-9]+)([^>]*?)(\s+hidden)?([^>]*?)>/g, (m, tag, a1, hiddenAttr, a2) => {
  const attrs = a1 + (a2 || '');
  const phases = /data-phases="([^"]+)"/.exec(attrs);
  const target = /data-target="([^"]+)"/.exec(attrs);
  if (!phases && !target) return m;
  const shouldHide = (phases && !phases[1].split(/\s+/).includes(PHASE_KEY)) || (target && !target[1].split(/\s+/).includes(TARGET));
  const cleaned = (a1 + (a2 || '')).replace(/\s+hidden\b/g, '');
  changes++;
  return `<${tag}${cleaned}${shouldHide ? ' hidden' : ''}>`;
});

// 3. marker blocks rendered from campaign.js
replaceBetween('stage-tracker', R.stageTracker(CAMPAIGN, PHASE_KEY));
replaceBetween('timeline', R.timeline(CAMPAIGN, PHASE_KEY));
replaceBetween('provisions', R.provisions(CAMPAIGN));
replaceBetween('redflags', R.redFlags(CAMPAIGN));
replaceBetween('cost', R.cost(CAMPAIGN));
replaceBetween('cost-strip', R.costStrip(CAMPAIGN));

// 4. countdown label/date, take-action copy, hero CTA target
const CD = PHASE.countdown || { show: false };
html = html.replace(/(<span id="cd-label">)[\s\S]*?(<\/span>)/, (m, a, b) => a + (CD.label || '') + b);
html = html.replace(/(<span class="cd-date" id="cd-date">)[\s\S]*?(<\/span>)/, (m, a, b) => a + (CD.dateText ? '&mdash; ' + CD.dateText : '') + b);
html = html.replace(/(<div class="countdown-card" id="countdown-card"[^>]*?)(\s+hidden)?(>)/, (m, a, h, c) => `${a}${CD.show ? '' : ' hidden'}${c}`);
const TAKE_ACTION_COPY = {
  legislators: { title: 'Contact Your Legislators', sub: 'Enter your address &mdash; we\'ll automatically find your Assembly Member and State Senator.' },
  governor: { title: 'Ask Governor Newsom to Veto AB 2017', sub: 'Two minutes: we write the letter, you send it through the Governor\'s official channels.' }
};
const copy = TAKE_ACTION_COPY[TARGET];
if (copy) {
  html = html.replace(/(<h2 style="text-align: center;" id="take-action-title">)[\s\S]*?(<\/h2>)/, (m, a, b) => a + copy.title + b);
  html = html.replace(/(id="take-action-sub">)[\s\S]*?(<\/p>)/, (m, a, b) => `${a}\n      ${copy.sub}\n    ${b}`);
}
html = html.replace(/(<a href=")[^"]*(" class="btn btn-primary" id="hero-cta")/, (m, a, b) => a + (TARGET === 'none' ? '#bill-status' : '#take-action') + b);
html = html.replace(/(<p class="share-footer-note" id="share-footer-note">)[\s\S]*?(<\/p>)/, (m, a, b) => {
  const txt = CD.show ? (PHASE.shareFooter || '').replace('{days}', '<span id="days-left-share">&mdash;</span>') : (PHASE.shareFooter || '');
  return `${a}\n      &#9201; ${txt}\n    ${b}`;
});

if (html !== before) {
  writeFileSync(file, html);
  console.log(`render-static: phase "${PHASE_KEY}" (target ${TARGET}) baked into index.html — ${changes} replacements`);
} else {
  console.log(`render-static: index.html already up to date for phase "${PHASE_KEY}"`);
}
