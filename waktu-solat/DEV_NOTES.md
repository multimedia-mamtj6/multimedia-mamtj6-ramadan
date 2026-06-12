# Session Handoff — waktu-solat/simple.html

**Last updated:** 2026-06-11 (Session 3)
**File being worked on:** `waktu-solat/simple.html` — a self-contained dark-mode prayer times widget (single HTML file, no build step, vanilla JS + SVG).

---

## Vibe / dynamic check for next session

This has been a smooth, fast, iterative session — no errors, no re-reads needed, no
file-state mismatches (unlike Session 2 which had recurring stale-state issues).
The user works in tight, low-friction loops:

- They throw a small, concrete request at you ("i want to use google font for icon...",
  "disable the highlight on syuruk time only", "put the zone selector and date on
  same line").
- For anything with layout/UX ambiguity, they'll ask you to pick — answer in
  2-3 sentences, recommend one option with the tradeoff, and let them confirm or
  redirect. They DID redirect once (zone name length concern) by pointing out a fact
  you didn't know (closed selector is already short) — when that happens, just drop
  the now-irrelevant tradeoff and proceed, don't re-litigate.
- For anything bigger/structural (Hijri date), they explicitly asked for clarifying
  questions FIRST and a confirmed plan before any code — respect that pattern if a
  similarly "structural" change comes up again. Small/cosmetic changes → just do it.
- Once a plan/approach is confirmed (even via a short "yep" or an implied-OK
  clarification), proceed directly to implementation without further check-ins.
- They test live in browser with `?testTime=`/`?testDate=` params — be ready for
  "i want to test" follow-ups meaning they're about to load the page, not that they
  want you to write tests.
- Communication is terse, lowercase, sometimes informal/shorthand ("yep", "ok good").
  Mirror that energy — don't over-explain finished work, just state what changed and
  invite testing feedback.

Overall mood: productive polish session, mosque widget steadily getting more
"complete" (icons, Hijri date, layout). No drama, no blockers. Next session will
likely continue in this same polish/refinement vein — small, scoped, visual/UX tweaks.

---

## What this file is

A standalone widget that:
- Fetches today's prayer times for a user-selected zone (default `PHG03`)
- Draws a quadratic bezier arc in SVG with 6 prayer dots (Subuh → Syuruk → Zohor → Asar → Maghrib → Isyak)
- Shows time labels and prayer name labels under each dot
- Displays a live countdown timer and info bar (current prayer / next prayer), each with a Material Symbols icon
- Recognizes a 7th "virtual" period — **Waktu Duha** — as a label-only state (no arc dot)
- Progress bar arc grows from Subuh to current time as the day advances
- Current prayer dot pulses with a ripple ring animation (rAF-based) — **except Syuruk**, which never gets "current" highlight styling
- Zone selector dropdown (grouped by state, compact when closed, full detail when open)
- Top bar: zone selector (left) + Gregorian/Hijri date (right), single row

---

## Current arc geometry constants (VERIFY IN FILE — past sessions had edit discrepancies)

```js
const ARC_W      = 360;      // SVG coordinate width
const ARC_PAD_X  = 20;
const DOT_PAD_X  = ARC_PAD_X; // = 20
const ARC_TOP_Y  = 14;
const ARC_BOT_Y  = 70;
const CTRL_Y     = 2 * ARC_TOP_Y - ARC_BOT_Y; // = -42
const VIEW_H     = 120;
```

Arc path: `M 20,70 Q 180,-42 340,70`

**Critical invariant:** `CTRL_Y = 2*ARC_TOP_Y - ARC_BOT_Y` MUST hold so that `arcY(x)` matches the actual bezier path exactly.

---

## Key functions

```js
timeToX(tsMs)         // maps prayer Unix-ms timestamp → SVG x (DOT_PAD_X to ARC_W-DOT_PAD_X)
arcY(x)               // maps SVG x → y position on the bezier arc
progressArcPath(t)    // de Casteljau bezier split at t∈[0,1]; returns SVG path string for elapsed portion
startPulseAnimation() // rAF loop: animates #pulseRing r (6→17) and opacity (0.7→0) over 1800ms
buildArcSvg()         // builds entire SVG; returns { svg, currentIdx, displayCurrentIdx, nextIdx }
renderArc()           // inserts SVG into DOM, starts pulse, starts countdown tick(), sets icons + currentName/Duha logic
tick()                // runs every second: updates countdown display + advances #progressArc path
getNow()              // returns Date.now() + timeOffset (supports ?testTime=/?testDate= URL params)
sizeSelect()          // resizes #zoneSelect to fit compact text exactly (canvas measurement + 32px padding)
loadZones()           // fetches zones API, builds grouped dropdown, wires focus/blur/change handlers
getSavedZone()        // reads ?zone= URL param → localStorage('selectedZone') → 'PHG03'
saveZone(code)        // writes to localStorage + updates ?zone= in URL (no reload)
fetchPrayerTimes()    // fetches API data, computes duhaStart/duhaEnd, builds dateText (Gregorian + Hijri)
```

---

## Session 3 changes (this session)

### 1. Material Symbols icons (replaced Unicode glyphs ☽☼☀☾)
Loaded via:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0&display=block" rel="stylesheet" />
```
`.info-side .icon` CSS:
```css
.info-side .icon {
  font-family: 'Material Symbols Rounded';
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 1.2rem;
  line-height: 1;
}
```
Icon spans now hold ligature text (`bedtime`, `sunny`, etc.) instead of Unicode chars.

`PRAYER_ICONS` map (around line 358):
```js
const PRAYER_ICONS = {
  Subuh:   'wb_twilight',
  Syuruk:  'wb_twilight',
  Duha:    'wb_twilight',
  Zohor:   'sunny',
  Asar:    'partly_cloudy_day',
  Maghrib: 'wb_twilight',
  Isyak:   'bedtime',
};
```
Note: user's spec literally said "Wb Twilight 2" for Subuh but Material Symbols only
has one `wb_twilight` ligature — used that for both Subuh/Syuruk/Duha/Maghrib (all
"twilight"-ish periods). If user complains about visual distinction between these
later, that's the likely cause — there's no separate "wb_twilight_2" icon to map to.

### 2. Syuruk never gets "current" highlight on arc
Single-line change in `buildArcSvg()` (~line 488):
```js
const isCurrent = i === displayCurrentIdx && prayer.name !== 'Syuruk';
```
This one boolean drives pulse ring, dot radius (6 vs 4), fill/stroke color, and label
weight/opacity for ALL nodes — so excluding Syuruk here is sufficient, no other
branches needed touching.

### 3. Hijri date display (ported from widget.html)
- Added `HIJRI_MONTH_NAMES` lookup (Muharram...Zulhijjah, keyed by `'01'`-`'12'`) right
  after `PRAYER_ICONS` (~line 368).
- `todayPrayer.hijri` from the waktusolat API is already `"YYYY-MM-DD"` — no extra
  fetch needed, and it automatically respects `?testDate=`/`?testTime=` since
  `todayPrayer` lookup is offset-aware via `getNow()`.
- In `fetchPrayerTimes()` (~line 694-697):
```js
const [hijriYear, hijriMonth, hijriDay] = todayPrayer.hijri.split('-');
const hijriMonthName = HIJRI_MONTH_NAMES[hijriMonth];

document.getElementById('dateText').textContent =
  `${days[now.getDay()]}, ${day} ${months[month - 1]} ${year} / ${parseInt(hijriDay, 10)} ${hijriMonthName} ${hijriYear}H`;
```
Result example: `"Khamis, 11 Jun 2026 / 15 Zulhijjah 1447H"`. Year format confirmed
by user as `1447H` (with "H" suffix, no space).

### 4. Top-bar layout restructure (zone selector + date, same row)
Combined what used to be a centered `.location-bar` and a separate bottom
`.footer-bar` into one `.top-bar` flex row at the very top of `.widget`:

```css
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}
.location-bar {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.footer-bar {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
}
```

```html
<div class="top-bar">
  <div class="location-bar">
    <span>📍</span>
    <select id="zoneSelect"><option value="">Memuat zon...</option></select>
  </div>
  <div class="footer-bar" id="footerBar" style="display:none">
    <span id="dateText">—</span>
  </div>
</div>

<div id="arcContainer">
```

The old standalone bottom `.footer-bar` block (after `.info-bar`) was REMOVED —
`#footerBar`/`#dateText` now live only in the top row.
`document.getElementById('footerBar').style.display = 'flex'` in JS still works fine
(it's now just a single-span wrapper inside the flex `.top-bar`, the `flex` display
on a non-flex-parent context is harmless).

Decision: zone selector LEFT, date info RIGHT — confirmed by user (closed zone
selector shows only "State - ZONE", so it's short; no overflow concern).

**STATUS: Just implemented, NOT yet visually tested by user.** If next session opens
with feedback about this layout (spacing, alignment, mobile wrap), that's the
follow-up.

---

## Carried over from Session 2 (still current)

### Waktu Duha (label-only, no arc dot)
```js
let duhaStart = null, duhaEnd = null;
// in fetchPrayerTimes():
duhaStart = todayPrayer.syuruk ? (todayPrayer.syuruk + 28 * 60) * 1000 : null;
duhaEnd   = todayPrayer.dhuhr  ? (todayPrayer.dhuhr  - 10 * 60) * 1000 : null;

// in renderArc():
const inDuha = duhaStart && duhaEnd && now >= duhaStart && now < duhaEnd;
const currentName = inDuha ? 'Duha' : (currentIdx >= 0 ? prayerList[currentIdx].name : 'Isyak');
if (inDuha) {
  currentTimeText = `${fmt24(duhaStart)}-${fmt24(duhaEnd)}`;
}
```
Duha = 28 min after Syuruk until 10 min before Zohor. Never enters `prayerList`, so
arc dots/positions are completely unaffected — purely an info-bar label override.

### Zone selector — API field names (IMPORTANT — wrong names caused "undefined" bug)
```
z.jakimCode  → zone code (e.g. "PHG03")
z.negeri     → state name (e.g. "Pahang")
z.daerah     → district (e.g. "Temerloh, Jerantut, Lipis, Raub, Cameron Highlands, Gua Musang")
```
NOT `z.state`, NOT `z.zone` — those return undefined.

### Compact/full display pattern
- **Closed:** `opt.dataset.compact = "${z.negeri} - ${z.jakimCode}"` e.g. `Pahang - PHG03`
- **Open:** `opt.dataset.full = "${z.jakimCode} — ${z.daerah}"` e.g. `PHG03 — Temerloh, Jerantut, Lipis`
- `focus` listener → restore all to `.dataset.full`
- `blur` listener → compact selected, full for rest; then call `sizeSelect()`
- `change` listener → compact selected immediately; then call `sizeSelect()`

### sizeSelect() — canvas-based width sizing
```js
const _sizeCanvas = document.createElement('canvas');
const _sizeCtx    = _sizeCanvas.getContext('2d');
function sizeSelect() {
  const sel = document.getElementById('zoneSelect');
  if (!sel) return;
  const text = sel.options[sel.selectedIndex]?.textContent || '';
  _sizeCtx.font = '11px Inter, system-ui, sans-serif';
  sel.style.width = (Math.ceil(_sizeCtx.measureText(text).width) + 32) + 'px';
}
```
The `+32` is intentional padding.

### #zoneSelect CSS
```css
appearance: none;
-webkit-appearance: none;  /* removes native browser arrow — eliminates trailing space */
background: transparent;
border: none;
color: rgba(255, 255, 255, 0.55);
font-size: 11px;
padding: 0;
/* NO max-width — width is set dynamically by sizeSelect() */
```

### Zone selector initialization
```js
currentZone = getSavedZone();
Promise.all([loadZones(), fetchPrayerTimes()]);
```
Both run in parallel — prayer data doesn't wait for the zone list to populate.

---

## ?testTime= / ?testDate= URL parameters (Session 1/2)

```js
let timeOffset = 0;

(function initTestTime() {
  const params = new URLSearchParams(window.location.search);
  const testTime = params.get('testTime');
  if (!testTime) return;
  const today = new Date();
  const [h, m] = testTime.split(':').map(Number);
  today.setHours(h, m, 0, 0);
  timeOffset = today.getTime() - Date.now();
})();

function getNow() { return Date.now() + timeOffset; }
```

All `Date.now()` calls in `buildArcSvg()`, `tick()`, and `fetchPrayerTimes()` use
`getNow()` instead. `fetchPrayerTimes()` uses `new Date(getNow())` to determine which
month's data to fetch and to find `todayPrayer`.

**Usage:**
```
simple.html?testTime=05:00          → before Subuh (progress arc full, Isyak pulsing)
simple.html?testTime=09:30          → in Duha window (after Syuruk+28min, before Zohor-10min)
simple.html?testTime=13:00          → Zohor time
simple.html?testTime=18:30          → near Maghrib
simple.html?zone=JHR01&testTime=18:30
simple.html?embed=1                 → strips page chrome (transparent bg, no card/shadow) for iframe embedding
```

---

## Architecture decisions from Session 1 (still current)

### Label collision fix
Syuruk/Subuh cluster left, Maghrib/Isyak cluster right (~27 SVG units apart). Arc
natural geometry (endpoints at y=70, inner dots at y≈53) gives ~17px vertical
separation. Only horizontal text-anchor divergence needed:
- `isCloseToPrev` → anchor `'start'`
- `isCloseToNext` → anchor `'end'`
- Subuh: anchor `'start'`, labelX `x - 10`
- Isyak: anchor `'end'`, labelX `x + 10`

**AVOID yBump** — it was tried and caused Syuruk labels to land at the same y as Subuh
(yBump=18 exactly cancelled the 17px natural gap).

### Progress arc (de Casteljau)
```js
const rawT = (now - fajr) / (isha - fajr);
// Post-midnight fix: rawT < 0 before today's Subuh → show full arc (all done)
progressArcPath(rawT < 0 ? 1 : rawT)
```

### currentIdx vs displayCurrentIdx
```js
// currentIdx = -1 before Subuh
const displayCurrentIdx = currentIdx >= 0 ? currentIdx : prayerList.length - 1;
// Before Subuh: Isyak dot pulses (not Subuh), isNext suppressed
const isNext = i === nextIdx && currentIdx >= 0;
```
NOTE: with the Session 3 Syuruk-exclusion change, if `displayCurrentIdx` ever points
at Syuruk's index, `isCurrent` will now be `false` for that node — verify this doesn't
leave NO node highlighted in edge cases (e.g. right at Syuruk time). Not yet tested
live; flag if user reports "no dot is highlighted" during Syuruk's time window.

### Pulse animation
CSS transform and SMIL both failed. Uses `requestAnimationFrame` directly setting `r`
and `opacity` on `#pulseRing`. Stops when element is removed (on re-render).

---

## Current visual spec

| Layer | stroke | stroke-width | opacity |
|---|---|---|---|
| Background arc (full) | white | 2 | 0.15 |
| Progress arc (elapsed) | white | 4 | 0.85 |
| Current dot | white | 2.5 | fill = #161b22 |
| Pulse ring | white | 1.5 | 0.7→0 animated |
| Past dot | white | 1.5 | fill 0.15, stroke 0.4 |
| Next dot | white | 1.5 | fill 0.95 |
| Future dot | white | 1.5 | fill 0.5 |

Label: `timeOffset = r + 13`, `nameOffset = timeOffset + 11`

---

## Known issues / things NOT yet done

1. **Color theming** — arc is all white on dark; warm gold/amber for progress arc
   might look better.
2. **GPS auto-detection** — not implemented in this widget (the main `jadual-waktu/`
   app has it). Could be added.

---

## User style notes

- Works iteratively, tests live with `?testTime=`/`?testDate=` in browser
- Prefers direct changes without lengthy explanation; terse, lowercase messages
- For structural/ambiguous changes: asks for clarifying Qs + plan confirmation first
- For cosmetic/small changes: just do it, report briefly, invite testing feedback
- Malay prayer time names: Subuh, Syuruk, Duha, Zohor, Asar, Maghrib, Isyak
- Dark theme: `#161b22` background, white text/strokes
- No frameworks, no build step — pure vanilla JS/HTML/CSS
- Language preference in UI: Malay (`lang="ms"`)
