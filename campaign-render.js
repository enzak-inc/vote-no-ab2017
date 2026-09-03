/* ==========================================================================
   campaign-render.js — pure HTML builders shared by the browser (index.html)
   and the build step (scripts/render-static.mjs). Keeping them in one place
   means the static HTML crawlers see and the live DOM are rendered by the
   same code. No DOM access in here.
   ========================================================================== */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.CAMPAIGN_RENDER = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {

  function resolvePhaseKey(campaign, requested) {
    if (requested && campaign.phases && campaign.phases[requested]) return requested;
    return campaign.phase;
  }

  function stageTracker(campaign, phaseKey) {
    if (!Array.isArray(campaign.stages)) return '';
    return campaign.stages.map(function (s) {
      const st = (s.status && s.status[phaseKey]) || 'next';
      const alt = s.altDone && s.altDone[phaseKey];
      let val;
      if (st === 'done') val = alt || s.done;
      else if (st === 'now') val = alt || (s.key === 'governor' ? 'Pending' : 'In progress');
      else if (st === 'fail') val = alt || 'Failed';
      else val = 'Not yet';
      const current = st === 'now' ? ' aria-current="step"' : '';
      return '<div class="stage ' + st + '" role="listitem"' + current + '><span class="lbl">' + s.label + '</span><span class="val">' + val + '</span><span class="sub">' + (s.sub || '') + '</span></div>';
    }).join('');
  }

  function timeline(campaign, phaseKey) {
    if (!Array.isArray(campaign.timeline)) return '';
    return campaign.timeline
      .filter(function (t) { return !t.phases || t.phases.indexOf(phaseKey) !== -1; })
      .map(function (t) { return '<div class="tl ' + (t.kind || 'step') + '"><span class="d">' + t.date + '</span><span class="t">' + t.text + '</span></div>'; })
      .join('');
  }

  // Each provision / red flag gets its own <h4 id> so AI retrieval chunks it as a
  // self-contained passage (heading text is embedded with the chunk).
  function provisions(campaign) {
    if (!Array.isArray(campaign.provisions)) return '';
    return campaign.provisions.map(function (p, i) {
      return '<div class="prov"><h4 class="t" id="provision-' + (i + 1) + '">' + p.t + '</h4><div class="d">' + p.d + '</div></div>';
    }).join('');
  }

  function redFlags(campaign) {
    if (!Array.isArray(campaign.redFlags)) return '';
    return campaign.redFlags.map(function (f, i) {
      return '<div class="flag"><h4 class="t" id="flag-' + (i + 1) + '">' + f.t + '</h4>' + (f.q ? '<blockquote>' + f.q + '</blockquote>' : '') + '<div class="d">' + f.d + '</div></div>';
    }).join('');
  }

  // Potential taxpayer cost: the strip under the hero and the full section.
  function costStrip(campaign) {
    var c = campaign.cost;
    if (!c) return '';
    return '<span class="lbl">' + c.label + '</span><span class="num">' + c.headline + '</span><span class="txt">' + c.stripText + '</span><span class="cta">' + (c.stripCta || 'See the math') + '</span>';
  }

  function cost(campaign) {
    var c = campaign.cost;
    if (!c) return '';
    var sources = (c.sources || []).map(function (s) {
      return '<a href="' + s.url + '" target="_blank" rel="noopener"><strong>' + s.t + '</strong>' + s.d + (s.pdf ? ' <span class="pdf">(<span class="u">PDF copy</span>: ' + s.pdf.replace(/^https?:\/\/([^/]+).*$/, '$1') + ')</span>' : '') + '</a>';
    }).join('');
    return '<div class="cost-card"><span class="lbl">' + c.label + '</span><div class="num">' + c.headline + '</div><div class="sub">' + c.sub + '</div><div class="cost-math" id="cost-math">' + c.formula + '</div><div class="perday"><b>' + c.perDay + '</b> ' + c.perDayLabel + '</div></div>'
      + '<div class="cost-body"><h3 id="how-we-got-the-number">How the Legislature’s own numbers produce it</h3>' + c.body + '<h3 id="cost-sources">Sources</h3><div class="cost-sources">' + sources + '</div></div>';
  }

  return { resolvePhaseKey: resolvePhaseKey, stageTracker: stageTracker, timeline: timeline, provisions: provisions, redFlags: redFlags, cost: cost, costStrip: costStrip };
});
