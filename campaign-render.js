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

  function provisions(campaign) {
    if (!Array.isArray(campaign.provisions)) return '';
    return campaign.provisions.map(function (p) {
      return '<div class="prov"><div class="t">' + p.t + '</div><div class="d">' + p.d + '</div></div>';
    }).join('');
  }

  function redFlags(campaign) {
    if (!Array.isArray(campaign.redFlags)) return '';
    return campaign.redFlags.map(function (f) {
      return '<div class="flag"><div class="t">' + f.t + '</div>' + (f.q ? '<blockquote>' + f.q + '</blockquote>' : '') + '<div class="d">' + f.d + '</div></div>';
    }).join('');
  }

  return { resolvePhaseKey: resolvePhaseKey, stageTracker: stageTracker, timeline: timeline, provisions: provisions, redFlags: redFlags };
});
