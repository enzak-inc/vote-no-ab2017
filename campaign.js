/* ==========================================================================
   campaign.js — THE ONE FILE TO EDIT WHEN THE BILL MOVES (or for a new bill)

   How it works
   ------------
   • `phase` picks which components show, which are hidden, and what they say.
     Nothing in index.html is deleted between phases — components carry
     data-phases="..." / data-target="..." attributes and the page hides what
     doesn't apply to the current phase.
   • Preview any phase WITHOUT editing: add ?phase=governor (or committee,
     floor, senate, signed, vetoed) to the URL.
   • Debug logging: set debug: true, or add ?debug=1 to the URL. Logs appear in
     the browser console tagged [PHASE] [LOOKUP] [LETTER] [COUNTER] [SHARE].
   • Placeholders in letters: {name} {street} {city} {zip} {personal}
     {asm} {sen} {ad} {sd} {districtLine} {days}
   ========================================================================== */
window.CAMPAIGN = {
  phase: 'governor',
  debug: false,

  site: {
    url: 'https://vote-no-ab2017.com/',
    name: 'Vote NO on AB 2017'
  },

  bill: {
    id: 'AB 2017',
    session: '2025–2026 Regular',
    title: 'State holidays: Eid.',
    introduced: 'February 17, 2026',
    author: { name: 'Matt Haney', party: 'D', district: 17, role: 'Bill Author — Asm. Matt Haney (AD 17)', email: 'assemblymember.haney@assembly.ca.gov' },
    sponsors: 'the Muslim Impact Council, CAIR-CA, and the California Commission on Asian and Pacific Islander American Affairs (CAPIAA)',
    leginfo: 'https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202520260AB2017',
    textVersion: 'as amended in Senate, August 27, 2026'
  },

  governor: {
    name: 'Gavin Newsom',
    shortName: 'Gov. Newsom',
    phone: '(916) 445-2841',
    hours: 'Mon–Fri, 9am–5pm',
    formUrl: 'https://www.gov.ca.gov/contact/',
    formTopic: 'An Active Bill',
    formPurpose: 'Leave a Comment',
    mail: ['Governor Gavin Newsom', '1021 O Street, Suite 9000', 'Sacramento, CA 95814'],
    email: null /* the Governor's office publishes no public email address */
  },

  /* ------------------------------------------------------------------------
     PHASES — one entry per stage of a bill's life. `target` decides who the
     action form writes to: 'legislators' (Assembly Member + Senator + author),
     'governor' (veto/sign request), or 'none' (outcome pages: form hidden).
     ------------------------------------------------------------------------ */
  phases: {

    committee: {
      label: 'Take Action',
      target: 'legislators',
      heroLead: 'California’s AB 2017 would declare two Islamic holidays as official state holidays. Enter your address — we’ll find your Assembly Member and State Senator automatically, then help you generate a personalized opposition email in under 2 minutes.',
      heroCta: 'Send the Email',
      countdown: { show: true, label: 'Assembly Floor Deadline', dateText: 'Sat, May 30, 2026', iso: '2026-05-30T23:59:59-07:00', expiredText: 'Assembly deadline passed' },
      statusPill: 'In Assembly Appropriations — floor vote by May 30',
      statusNarrative: 'As of late April 2026 it has cleared two Assembly committees (Governmental Organization, Public Employment &amp; Retirement) unanimously and is now awaiting an <strong>Assembly Appropriations Committee</strong> hearing. The final Assembly floor vote must happen by <strong>May 30, 2026</strong>.',
      step2Title: 'Your Legislators',
      lookupButton: 'Find My Legislators',
      shareFooter: '{days} days left until the May 30 Assembly floor deadline',
      shareLead: 'Your email reaches 3 legislators. <strong>A friend’s email reaches 3 more.</strong> Take 10 seconds to pass this along — that’s how grassroots movements actually work.',
      share: {
        title: 'Vote NO on California AB 2017',
        short: 'California AB 2017 would make 2 Islamic holidays CA state holidays. Contact your reps in 2 min (free, no sign-up):',
        long: 'Hey — California’s AB 2017 would formally declare 2 Islamic holidays as CA state holidays. There’s a free tool that finds your state Assembly Member and Senator from your address and sends a personalized opposition email in about 2 minutes. No sign-up, no tracking. Please take a look and pass it on:'
      },
      outcome: null
    },

    floor: {
      label: 'Assembly Floor Vote',
      target: 'legislators',
      heroLead: 'AB 2017 cleared every Assembly committee and is headed for a floor vote. Enter your address — we’ll find your Assembly Member and State Senator automatically, then help you generate a personalized opposition email in under 2 minutes.',
      heroCta: 'Send the Email',
      countdown: { show: true, label: 'Assembly Floor Deadline', dateText: 'Sat, May 30, 2026', iso: '2026-05-30T23:59:59-07:00', expiredText: 'Assembly deadline passed' },
      statusPill: 'Out of committee — Assembly floor vote pending',
      statusNarrative: 'It passed Assembly Governmental Organization 19–0, Public Employment &amp; Retirement 7–0, and Appropriations 12–1. The final Assembly floor vote must happen by <strong>May 30, 2026</strong>.',
      step2Title: 'Your Legislators',
      lookupButton: 'Find My Legislators',
      shareFooter: '{days} days left until the May 30 Assembly floor deadline',
      shareLead: 'Your email reaches 3 legislators. <strong>A friend’s email reaches 3 more.</strong> Take 10 seconds to pass this along — that’s how grassroots movements actually work.',
      share: {
        title: 'Vote NO on California AB 2017',
        short: 'California AB 2017 would make 2 Islamic holidays CA state holidays. Contact your reps in 2 min (free, no sign-up):',
        long: 'Hey — California’s AB 2017 would formally declare 2 Islamic holidays as CA state holidays. There’s a free tool that finds your state Assembly Member and Senator from your address and sends a personalized opposition email in about 2 minutes. No sign-up, no tracking. Please take a look and pass it on:'
      },
      outcome: null
    },

    senate: {
      label: 'Now in the Senate',
      target: 'legislators',
      heroLead: 'AB 2017 passed the Assembly 64–1 on May 26 and is now in the State Senate. Enter your address — we’ll find your State Senator and Assembly Member automatically, then help you generate a personalized opposition email in under 2 minutes.',
      heroCta: 'Send the Email',
      countdown: { show: true, label: 'Senate Floor Deadline', dateText: 'Mon, Aug 31, 2026', iso: '2026-08-31T23:59:59-07:00', expiredText: 'Legislative deadline passed' },
      statusPill: 'Passed Assembly 64–1 — now in the Senate',
      statusNarrative: 'It passed the Assembly floor <strong>64–1</strong> on May 26, 2026 and moved to the Senate, where it must clear Governmental Organization, Education, and Appropriations before a floor vote. The Legislature’s last day to pass bills is <strong>August 31, 2026</strong>.',
      step2Title: 'Your Legislators',
      lookupButton: 'Find My Legislators',
      shareFooter: '{days} days left until the Aug 31 Senate deadline',
      shareLead: 'Your email reaches 3 legislators. <strong>A friend’s email reaches 3 more.</strong> Take 10 seconds to pass this along — that’s how grassroots movements actually work.',
      share: {
        title: 'Vote NO on California AB 2017',
        short: 'California AB 2017 (2 Islamic holidays as CA state holidays) passed the Assembly and is in the Senate now. Contact your reps in 2 min (free, no sign-up):',
        long: 'Hey — California’s AB 2017 passed the Assembly and is in the State Senate now. There’s a free tool that finds your State Senator and Assembly Member from your address and sends a personalized opposition email in about 2 minutes. No sign-up, no tracking. Please take a look and pass it on:'
      },
      outcome: null
    },

    governor: {
      label: 'On the Governor’s Desk',
      target: 'governor',
      heroLead: 'AB 2017 passed the Legislature on August 30. It adds two Islamic holidays to California’s state holiday calendar. <strong>Only Governor Newsom can stop it now</strong>, and he must sign or veto by September 30. This page writes your veto request in under 2 minutes and points you to his office.',
      heroCta: 'Ask for a Veto',
      countdown: { show: true, label: 'Governor’s Deadline to Sign or Veto', dateText: 'Wed, Sept 30, 2026', iso: '2026-09-30T23:59:59-07:00', expiredText: 'Deadline passed — awaiting the Governor’s decision' },
      statusPill: 'Passed Legislature Aug 30 — awaiting Gov. Newsom (deadline Sept 30)',
      statusNarrative: 'It passed the Assembly <strong>64–1</strong> (May 26), the Senate <strong>30–4</strong> (Aug 30), and a final Assembly concurrence vote <strong>62–3</strong> the same day. It is now being enrolled and sent to <strong>Governor Newsom</strong>, who has until <strong>September 30, 2026</strong> to sign or veto. A veto is the only remaining way to stop it.',
      step2Title: 'Contact the Governor',
      lookupButton: 'Find My District',
      shareFooter: '{days} days left until Gov. Newsom’s Sept 30 deadline',
      shareLead: 'One veto request is a data point. <strong>A hundred is a signal.</strong> Take 10 seconds to pass this along before September 30.',
      share: {
        title: 'Ask Gov. Newsom to VETO AB 2017',
        short: 'California AB 2017 (2 Islamic holidays as CA state holidays) passed the Legislature. Only Gov. Newsom can veto it — deadline Sept 30. Ask him in 2 min (free, no sign-up):',
        long: 'Hey — California’s AB 2017 passed both houses on Aug 30. It adds Eid al-Fitr and Eid al-Adha to the state holiday calendar. The only thing left is Gov. Newsom’s signature or veto, and his deadline is Sept 30. There’s a free tool that writes a veto request in about 2 minutes and points you to his office. No sign-up, no tracking. Please take a look and pass it on:'
      },
      outcome: null
    },

    signed: {
      label: 'Signed Into Law',
      target: 'none',
      heroLead: 'Governor Newsom signed AB 2017. Eid al-Fitr and Eid al-Adha join California’s state holiday calendar on January 1, 2027. This page stays up as a record of what the bill does, how it moved, and who voted for it.',
      heroCta: 'What Happens Now',
      countdown: { show: false },
      statusPill: 'Signed into law — effective Jan 1, 2027',
      statusNarrative: 'Governor Newsom signed AB 2017 in September 2026 (UPDATE: add the signing date and chapter number). It takes effect <strong>January 1, 2027</strong>. Local school and community college boards decide, through union agreements, whether to close on the Eid dates; state employees may elect Eid holiday credit; the State Board of Education may adopt a model curriculum guide.',
      step2Title: 'Contact the Governor',
      lookupButton: 'Find My District',
      shareFooter: 'AB 2017 was signed into law',
      shareLead: 'The bill is law, but the record matters. Share what’s actually in it.',
      share: {
        title: 'AB 2017 was signed — here’s what it actually does',
        short: 'Gov. Newsom signed AB 2017 (2 Islamic holidays as CA state holidays). Here’s what’s actually in the final text, and who voted for it:',
        long: 'Hey — Gov. Newsom signed California’s AB 2017, adding Eid al-Fitr and Eid al-Adha to the state holiday calendar. This page has the verified timeline, every vote, and the parts of the final text that got no coverage. Worth a look:'
      },
      outcome: {
        heading: 'AB 2017 was signed into law',
        body: '<p><strong>What changes on January 1, 2027:</strong> both Eids are on the state holiday list; courts stay open; school and community college boards may close on those dates only through a negotiated agreement with their unions; classified staff may get a paid holiday through the same agreements; state employees may elect 8 hours of holiday credit; schools may hold Eid exercises and the State Board of Education may publish a model curriculum guide.</p><p><strong>What you can still do:</strong> your local school board decides whether your district closes. Board meetings are public. The agenda item will be a memorandum of understanding (MOU) with the district’s employee unions.</p>'
      }
    },

    vetoed: {
      label: 'Vetoed',
      target: 'none',
      heroLead: 'Governor Newsom vetoed AB 2017. Thank you to everyone who called and wrote. This page stays up as a record of the bill, the votes, and the veto.',
      heroCta: 'Read the Record',
      countdown: { show: false },
      statusPill: 'Vetoed by Gov. Newsom',
      statusNarrative: 'Governor Newsom vetoed AB 2017 in September 2026 (UPDATE: add the veto date and quote the veto message). The Legislature can override a veto with a two-thirds vote in each house, which it has not done since 1980.',
      step2Title: 'Contact the Governor',
      lookupButton: 'Find My District',
      shareFooter: 'AB 2017 was vetoed',
      shareLead: 'It worked. Thank the people who called and wrote by sharing the result.',
      share: {
        title: 'Gov. Newsom vetoed AB 2017',
        short: 'Gov. Newsom vetoed California AB 2017 (2 Islamic holidays as CA state holidays). Thank you to everyone who called and wrote:',
        long: 'Hey — Gov. Newsom vetoed California’s AB 2017. Thank you to everyone who called and wrote. The full record (timeline, votes, veto message) is here:'
      },
      outcome: {
        heading: 'AB 2017 was vetoed',
        body: '<p>Governor Newsom returned AB 2017 without his signature. (UPDATE: quote the veto message here.) The Legislature may override a veto with a two-thirds vote in both houses; California’s last successful override was in 1980.</p><p>Thank you to everyone who called (916) 445-2841 and wrote through the Governor’s contact form.</p>'
      }
    }
  },

  /* ------------------------------------------------------------------------
     TIMELINE — verified against the official bill history and vote record on
     leginfo.legislature.ca.gov (checked Sept 2, 2026). kind: step | vote |
     flag | now | deadline | future. `phases` limits an entry to some phases.
     ------------------------------------------------------------------------ */
  timeline: [
    { date: 'Feb 17, 2026', kind: 'step', text: 'Introduced by Assemblymember Matt Haney (D–San Francisco).' },
    { date: 'Mar 2', kind: 'step', text: 'Referred to Assembly Governmental Organization and Public Employment &amp; Retirement.' },
    { date: 'Mar 12', kind: 'step', text: 'Public launch during Ramadan. Co-sponsors: CAIR-CA, Muslim Impact Council, CAPIAA.' },
    { date: 'Apr 8', kind: 'vote', text: 'Assembly Governmental Organization: <strong>passed 19–0</strong>.' },
    { date: 'Apr 22', kind: 'vote', text: 'Assembly Public Employment &amp; Retirement: <strong>passed 7–0</strong>.' },
    { date: 'May 14', kind: 'vote', text: 'Assembly Appropriations: <strong>passed 12–1</strong>, with amendments.' },
    { date: 'May 26', kind: 'vote', text: 'Assembly floor: <strong>passed 64–1</strong>. Sole NO: Carl DeMaio (R–San Diego).' },
    { date: 'Jun 3', kind: 'step', text: 'In the Senate. Referred to Governmental Organization and Education.' },
    { date: 'Jun 16', kind: 'flag', text: 'Senate amendments <strong>delete the student excused-absence guarantee</strong> (Education Code 48205) that sponsors advertised.' },
    { date: 'Jun 23', kind: 'vote', text: 'Senate Governmental Organization: <strong>passed 11–1</strong>.' },
    { date: 'Jul 1', kind: 'vote', text: 'Senate Education: <strong>passed 5–1</strong>.' },
    { date: 'Aug 3', kind: 'step', text: 'Senate Appropriations: placed on the suspense file.' },
    { date: 'Aug 13', kind: 'flag', text: 'Senate Appropriations: <strong>passed 5–0</strong>. Same amendment softens school exercises “acknowledging and celebrating the meaning and importance” of Eid to “exploring the history” after public criticism.' },
    { date: 'Aug 27', kind: 'step', text: 'Final Senate floor amendments. This is the text on the Governor’s desk.' },
    { date: 'Aug 30', kind: 'vote', text: 'Senate floor: <strong>passed 30–4</strong>. NO: Grove, Ochoa Bogh, Seyarto, Strickland.' },
    { date: 'Aug 30', kind: 'vote', text: 'Assembly concurrence in Senate amendments: <strong>passed 62–3</strong>. NO: DeMaio, Dixon, Sanchez. Sent to enrolling.' },
    { date: 'Aug 31', kind: 'step', text: 'Legislature adjourns for the year. CAIR-CA urges the Governor to sign.' },
    { date: 'Now', kind: 'now', phases: ['governor'], text: 'On Governor Newsom’s desk. No signature or veto yet.' },
    { date: 'Sept 30', kind: 'deadline', phases: ['committee', 'floor', 'senate', 'governor'], text: 'Last day for the Governor to sign or veto.' },
    { date: 'Sept 2026', kind: 'now', phases: ['signed'], text: 'Signed by Governor Newsom. (UPDATE: exact date and chapter number.)' },
    { date: 'Sept 2026', kind: 'now', phases: ['vetoed'], text: 'Vetoed by Governor Newsom. (UPDATE: exact date.)' },
    { date: 'Jan 1, 2027', kind: 'future', phases: ['committee', 'floor', 'senate', 'governor', 'signed'], text: 'Takes effect if signed.' }
  ],

  /* ------------------------------------------------------------------------
     STAGE TRACKER — the row of boxes above the timeline.
     status per phase: done | now | next | fail
     ------------------------------------------------------------------------ */
  stages: [
    { key: 'assembly', label: 'Assembly floor', done: 'Passed 64–1', sub: 'May 26', status: { committee: 'now', floor: 'now', senate: 'done', governor: 'done', signed: 'done', vetoed: 'done' } },
    { key: 'senate', label: 'Senate floor', done: 'Passed 30–4', sub: 'Aug 30', status: { committee: 'next', floor: 'next', senate: 'now', governor: 'done', signed: 'done', vetoed: 'done' } },
    { key: 'concur', label: 'Assembly concurrence', done: 'Passed 62–3', sub: 'Aug 30', status: { committee: 'next', floor: 'next', senate: 'next', governor: 'done', signed: 'done', vetoed: 'done' } },
    { key: 'governor', label: 'Governor', done: 'Pending', sub: 'Sign or veto by Sept 30', status: { committee: 'next', floor: 'next', senate: 'next', governor: 'now', signed: 'done', vetoed: 'fail' }, altDone: { signed: 'Signed', vetoed: 'Vetoed' } },
    { key: 'outcome', label: 'Outcome', done: 'Law or veto', sub: 'Effective Jan 1, 2027 if signed', status: { committee: 'next', floor: 'next', senate: 'next', governor: 'next', signed: 'now', vetoed: 'now' }, altDone: { signed: 'Law', vetoed: 'Dead' } }
  ],

  /* ------------------------------------------------------------------------
     POTENTIAL TAXPAYER COST — every number comes from the Legislature's own
     fiscal analyses of AB 2017 (Senate Appropriations, Aug 13, 2026; Assembly
     Appropriations, May 6, 2026) and of the identical Diwali law (AB 268,
     Senate Appropriations, Aug 18, 2025). We only multiplied by two.
     ------------------------------------------------------------------------ */
  cost: {
    label: 'Potential Taxpayer Cost',
    headline: '$137.6 million',
    sub: 'potential statewide K–12 classified payroll exposure from two paid Eid holidays',
    perDay: '$68.8 million',
    perDayLabel: 'per statewide paid day for classified school employees (CDE estimate)',
    days: 2,
    formula: '<b>$68.8 million</b> per paid day &times; <b>2</b> Eid holidays = <b>$137.6 million</b>',
    stripText: 'in potential K–12 payroll exposure, using the Legislature’s own per-day estimate.',
    stripCta: 'See the math &darr;',
    body: '<p>California has not published a final statewide price tag for AB 2017. The Legislature’s own fiscal analyses of the bill show how large the exposure could be if school districts broadly adopt its paid-holiday provision.</p>'
      + '<p>In the <strong>Senate Appropriations Committee analysis of AB 2017</strong> (August 13, 2026), the California Department of Education reported that K–12 local educational agencies paid <strong>$17.78 billion</strong> in classified-employee salaries in 2023–24. Assuming 260 unadjusted working days, CDE put the statewide cost of <strong>one day of classified pay at approximately $68.8 million</strong>. The same CDE figure appears in the Senate’s 2025 analysis of the Diwali holiday law (AB 268), which AB 2017 copies.</p>'
      + '<p>AB 2017 authorizes <strong>two</strong> paid holidays, Eid al-Fitr and Eid al-Adha, for classified school employees wherever a district’s board agrees in a memorandum of understanding (Education Code 45203). Applying the Legislature’s own method, two statewide paid days represent approximately <strong>$137.6 million in K–12 classified payroll exposure</strong>.</p>'
      + '<p><strong>This is not a claim that AB 2017 will automatically cost taxpayers $137.6 million.</strong> Actual costs depend on how many districts negotiate the holidays and whether they add the days or swap them for existing paid days. But the bill’s own <strong>Assembly Appropriations analysis</strong> (May 6, 2026) calls the cost pressures “unknown, but potentially significant,” notes there are over 900 school districts and 73 community college districts, and warns that when a holiday falls on a Tuesday or Thursday attendance drops around it: “since K-12 public schools are funded by student attendance … this bill could result in reduced school funding.” The Senate analysis adds community-college costs “in the tens to low hundreds of thousands of dollars,” $300,000 to develop the state curriculum guide, and it all lands as the Legislative Analyst’s Office warns of General Fund deficits of around $35 billion a year from 2027–28.</p>'
      + '<p>The $137.6 million figure is a transparent exposure calculation built on the Legislature’s $68.8-million-per-day estimate, not a number invented by this site.</p>',
    sources: [
      { t: 'Senate Appropriations Committee, AB 2017 analysis (Aug 13, 2026)', d: '“The statewide cost of one day of pay for classified employees … is approximately $68.8 million.” Unknown, potentially significant fiscal impact to LEAs (Proposition 98 General Fund).', url: 'https://leginfo.legislature.ca.gov/faces/billAnalysisClient.xhtml?bill_id=202520260AB2017', pdf: 'https://billtexts.s3.amazonaws.com/ca/ca-analysishttps-leginfo-legislature-ca-gov-faces-billAnalysisClient-xhtml-bill-id-202520260AB2017-ca-analysis-403551.pdf' },
      { t: 'Assembly Appropriations Committee, AB 2017 analysis (May 6, 2026)', d: '“Costs pressures of an unknown, but potentially significant amount, in excess of $150,000, across school districts and community college districts …” plus the attendance-funding warning and the LAO deficit note.', url: 'https://leginfo.legislature.ca.gov/faces/billAnalysisClient.xhtml?bill_id=202520260AB2017', pdf: 'https://billtexts.s3.amazonaws.com/ca/ca-analysishttps-leginfo-legislature-ca-gov-faces-billAnalysisClient-xhtml-bill-id-202520260AB2017-ca-analysis-397629.pdf' },
      { t: 'Senate Appropriations Committee, AB 268 (Diwali) analysis (Aug 18, 2025)', d: 'CDE: LEAs paid $17,781,260,179 in classified salaries in 2023–24; one statewide day of classified pay ≈ $68.8 million. The precedent AB 2017 is modeled on.', url: 'https://leginfo.legislature.ca.gov/faces/billAnalysisClient.xhtml?bill_id=202520260AB268', pdf: 'https://billtexts.s3.amazonaws.com/ca/ca-analysishttps-leginfo-legislature-ca-gov-faces-billAnalysisClient-xhtml-bill-id-202520260AB268-ca-analysis-390765.pdf' }
    ]
  },

  /* ------------------------------------------------------------------------
     WHAT THE FINAL TEXT DOES — plain language, from the Legislative Counsel's
     Digest and the amended code sections (Aug 27, 2026 text).
     ------------------------------------------------------------------------ */
  provisions: [
    { t: 'Adds both Eids to the state holiday list', d: 'Government Code 6700. Dates are set by the Islamic lunar calendar: the first day of Shawwal and the 10th day of Dhu al-Hijjah.' },
    { t: 'Courts stay open', d: 'Both dates are excluded from judicial holidays (Code of Civil Procedure 135).' },
    { t: 'Schools and community colleges may close, only by union agreement', d: 'A district can close on the Eid dates if its board reaches a memorandum of understanding with employee unions (Education Code 37220.7, 79020). Same mechanism as Native American Day and Diwali.' },
    { t: 'Paid holidays for classified staff, by the same agreements', d: 'Classified school and community college employees may receive a paid holiday on both dates if the board agrees in the MOU (Education Code 45203, 88203).' },
    { t: 'State employees may elect Eid holiday credit', d: '8 hours of holiday credit for Eid in lieu of a personal holiday (Government Code 19853, 19853.1). Not a new paid day off for everyone.' },
    { t: 'Eid exercises in schools, plus a state curriculum guide', d: 'Schools may hold exercises “exploring the history of Eid al-Fitr and Eid al-Adha,” and the State Board of Education may adopt a model curriculum guide (Education Code 37220.7(e)).' },
    { t: 'No new student excused-absence guarantee', d: 'The introduced bill added Eid to required excused absences (Education Code 48205). That section was removed on June 16. Existing law already allows religious absences with a parent’s note.' }
  ],

  /* ------------------------------------------------------------------------
     RED FLAGS — items in the final text worth pointing out. Every quote is
     verbatim from the Aug 27, 2026 text on leginfo.legislature.ca.gov.
     ------------------------------------------------------------------------ */
  redFlags: [
    {
      t: 'The word “religion” appears zero times',
      q: 'Eid al-Fitr and Eid al-Adha are culturally significant … The designation of Eid al-Fitr and Eid al-Adha as state holidays is a civil calendar determination',
      d: 'Two religious holidays are written into law as “cultural” and a “civil calendar determination.” The bill never uses the words religion, religious, or Muslim. Earlier drafts did; the final text scrubbed them.'
    },
    {
      t: 'Its own findings name attendance money as a purpose',
      q: 'The civil purposes of this act are to … protect public school average daily attendance funding metrics',
      d: 'Districts lose state funding when students are absent. Closing school on Eid protects the funding formula. The Legislature put that in writing.'
    },
    {
      t: 'A blanket holiday instead of individual accommodation',
      q: 'Following the standard established by the U.S. Supreme Court in Groff v. DeJoy (2023) 600 U.S. 447, public employers face significantly heightened legal burdens when reviewing individual accommodation requests.',
      d: 'The findings argue that case-by-case religious accommodation is now too burdensome for public employers, so the state should designate the days instead.'
    },
    {
      t: 'Paid days for staff, decided in union negotiations',
      q: 'the classified service may be entitled to a paid holiday on … “Eid al-Fitr” … “Eid al-Adha” … if the governing board, pursuant to a memorandum of understanding … agrees to the paid holiday.',
      d: 'Education Code 45203 and 88203. Two more paid holidays become a bargaining chip in every school and community college district. Districts carry the cost.'
    },
    {
      t: 'The Legislature priced one paid day at $68.8 million',
      q: 'Assuming 260 unadjusted working days, the statewide cost of one day of pay for classified employees of school districts, county offices of education, charter schools, and K-12 joint powers authorities is approximately $68.8 million.',
      d: 'Senate Appropriations Committee analysis of AB 2017, August 13, 2026. Two Eid holidays make that $137.6 million of potential K–12 payroll exposure, depending on how many districts adopt them. The Assembly analysis calls the cost pressures “unknown, but potentially significant.” See the taxpayer-cost section above.'
    },
    {
      t: 'Eid exercises in classrooms and a state model curriculum',
      q: 'public schools and educational institutions throughout this state may include exercises, funded through existing resources, exploring the history of Eid al-Fitr and Eid al-Adha. The State Board of Education may adopt a model curriculum guide',
      d: 'Education Code 37220.7(e). From February through June the same clause read “acknowledging and celebrating the meaning and importance” of Eid, copied word for word from the 2025 Diwali law. It was softened on August 13 after public criticism. As the California Family Council points out, no California statute authorizes school exercises for Christmas, Easter, or Good Friday.'
    },
    {
      t: 'Bargaining units pick the date',
      q: 'For those holidays whose dates vary annually, the employee may instead make the election on the dates designated by their group.',
      d: 'Government Code 19853. Because Eid moves with the lunar calendar, the date a state employee takes off is set by their bargaining unit, not by the calendar.'
    },
    {
      t: 'Moving dates that depend on the moon',
      q: 'the first day of the month of Shawwal in the Islamic lunar calendar … the 10th day of the month of Dhu al-Hijjah in the Islamic lunar calendar',
      d: 'Neither holiday has a fixed civil date. They shift about 11 days earlier each year and can fall on different days for different communities depending on moon sighting.'
    },
    {
      t: 'The student protection sponsors advertised was deleted',
      q: 'This bill would add an absence for purposes of observing “Eid al-Fitr” or “Eid al-Adha” to the list of required excused absences.',
      d: 'That sentence is from the introduced bill (Feb 17). The Senate removed the excused-absence section on June 16. The sponsors’ fact sheet still claims the bill “guarantees excused absences for students.” What survived is paid days for staff, optional closures, and optional curriculum.'
    },
    {
      t: 'Calendar creep',
      q: 'operative only if this bill and AB 2294 are enacted … SB 1394 … AB 1841',
      d: 'AB 2017 sits on the Governor’s desk alongside three more holiday bills this month: Sylvia Mendez Day (AB 2294), Farmworkers Day (SB 1394), and Native American Day changes (AB 1841). Diwali was added in 2025, Lunar New Year in 2022.'
    }
  ],

  /* ------------------------------------------------------------------------
     LETTERS — one per target. Placeholders are filled by index.html.
     ------------------------------------------------------------------------ */
  letters: {
    legislators: {
      subject: 'Constituent Opposition to AB 2017 — {city}, CA',
      body: 'Dear Asm. {asm}, Sen. {sen}, and Asm. Haney,\n\nI am writing as your constituent to respectfully urge a NO vote on AB 2017.\n\n{personal}\n\nCalifornia has traditionally avoided formally recognizing specific religious holidays in statute, in order to maintain neutrality and fairness across all faiths. AB 2017 departs from that principle. Religious observance is already protected under existing California and federal law through reasonable accommodations, paid leave, and excused student absences — no new statute is required to respect Muslim Californians.\n\nFor consistency and equal treatment across all faiths, I urge a NO vote on AB 2017.\n\nThank you for representing our district.\n\nSincerely,\n{name}\n{street}\n{city}, CA {zip}'
    },
    governor: {
      subject: 'Please veto AB 2017 — {city}, CA resident',
      body: 'Dear Governor Newsom,\n\nI am a California resident writing to respectfully ask you to VETO AB 2017 (State holidays: Eid).\n\n{personal}\n\nAB 2017 adds two religious holidays to the state calendar, yet the bill text never uses the word “religion,” calling the change a “civil calendar determination.” Its own findings say one purpose is to protect school attendance funding. It lets districts add paid holidays for staff through union agreements, and it authorizes classroom Eid exercises and a state model curriculum guide. The student excused-absence guarantee the sponsors advertised was removed in June. Religious observance is already protected under existing California and federal law.\n\nThe Senate Appropriations Committee’s own analysis prices one statewide paid day for classified school staff at about $68.8 million. Two Eid holidays expose K–12 payroll to roughly $137.6 million if districts adopt them, at a time the Legislative Analyst warns of $35 billion annual deficits.\n\nCalifornia has long kept its statutes neutral toward specific faiths. For neutrality and equal treatment across all faiths, please veto AB 2017.\n\nThank you for your consideration.\n\nSincerely,\n{name}\n{street}\n{city}, CA {zip}{districtLine}'
    }
  },

  polishPrompt: {
    legislators: 'I’m writing an email to my California state legislators opposing AB 2017, a bill that would formally recognize two Islamic holidays (Eid al-Fitr and Eid al-Adha) as California state holidays.',
    governor: 'I’m writing to California Governor Gavin Newsom asking him to veto AB 2017, a bill that adds two Islamic holidays (Eid al-Fitr and Eid al-Adha) to the California state holiday calendar. The bill has already passed the Legislature; only the Governor can stop it.'
  }
};
