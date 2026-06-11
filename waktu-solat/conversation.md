# Session Handoff — waktu-solat/simple.html

**Last updated:** 2026-06-05 (Session 2)
**File being worked on:** `waktu-solat/simple.html` — a self-contained dark-mode prayer times widget (single HTML file, no build step, vanilla JS + SVG).

---

## What this file is

A standalone widget that:
- Fetches today's prayer times for a user-selected zone (default `PHG03`)
- Draws a quadratic bezier arc in SVG with 6 prayer dots (Subuh → Syuruk → Zohor → Asar → Maghrib → Isyak)
- Shows time labels and prayer name labels under each dot
- Displays a live countdown timer and info bar (current prayer / next prayer)
- Progress bar arc grows from Subuh to current time as the day advances
- Current prayer dot pulses with a ripple ring animation (rAF-based)
- Zone selector dropdown (grouped by state, compact when closed, full detail when open)
- Date displayed in footer bar (centered)

---

## Current arc geometry constants (VERIFY IN FILE — past sessions had edit discrepancies)

```js
const ARC_W      = 360;      // SVG coordinate width — NOTE: conversation.md previously said 440, but file reads 360. TRUST THE FILE.
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
renderArc()           // inserts SVG into DOM, starts pulse, starts countdown tick()
tick()                // runs every second: updates countdown display + advances #progressArc path
getNow()              // returns Date.now() + timeOffset (supports ?testTime= URL param)
sizeSelect()          // resizes #zoneSelect to fit compact text exactly (canvas measurement + 32px padding)
loadZones()           // fetches zones API, builds grouped dropdown, wires focus/blur/change handlers
getSavedZone()        // reads ?zone= URL param → localStorage('selectedZone') → 'PHG03'
saveZone(code)        // writes to localStorage + updates ?zone= in URL (no reload)
```

---

## Zone selector — implemented this session

### API field names (IMPORTANT — wrong names caused "undefined" bug)
```
z.jakimCode  → zone code (e.g. "PHG03")
z.negeri     → state name (e.g. "Pahang")
z.daerah     → district (e.g. "Temerloh, Jerantut, Lipis, Raub, Cameron Highlands, Gua Musang")
```
NOT `z.state`, NOT `z.zone` — those return undefined. Use `negeri` and `daerah`.

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
The `+32` is intentional padding — user asked to expand slightly. Adjust if needed.

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

## ?testTime= URL parameter — implemented this session

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

All `Date.now()` calls in `buildArcSvg()`, `tick()`, and `fetchPrayerTimes()` use `getNow()` instead.
`fetchPrayerTimes()` uses `new Date(getNow())` to determine which month's data to fetch.

**Usage:**
```
simple.html?testTime=05:00          → before Subuh (progress arc full, Isyak pulsing)
simple.html?testTime=13:00          → Zohor time
simple.html?testTime=18:30          → near Maghrib
simple.html?zone=JHR01&testTime=18:30
```

---

## Layout — location bar and footer

```css
.location-bar {
  justify-content: center;  /* zone selector centered */
}
.footer-bar {
  justify-content: center;  /* date centered */
}
```

```html
<div class="location-bar">
  <span>📍</span>
  <select id="zoneSelect"><option value="">Memuat zon...</option></select>
</div>
...
<div class="footer-bar" id="footerBar" style="display:none">
  <span id="dateText">—</span>
</div>
```

---

## Architecture decisions from Session 1 (still current)

### Label collision fix
Syuruk/Subuh cluster left, Maghrib/Isyak cluster right (~27 SVG units apart). Arc natural geometry (endpoints at y=70, inner dots at y≈53) gives ~17px vertical separation. Only horizontal text-anchor divergence needed:
- `isCloseToPrev` → anchor `'start'`
- `isCloseToNext` → anchor `'end'`
- Subuh: anchor `'start'`, labelX `x - 10`
- Isyak: anchor `'end'`, labelX `x + 10`

**AVOID yBump** — it was tried and caused Syuruk labels to land at the same y as Subuh (yBump=18 exactly cancelled the 17px natural gap).

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

### Pulse animation
CSS transform and SMIL both failed. Uses `requestAnimationFrame` directly setting `r` and `opacity` on `#pulseRing`. Stops when element is removed (on re-render).

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

1. **ARC_W discrepancy** — `conversation.md` Session 1 said `ARC_W = 440` (after an expand edit). But the file now reads `ARC_W = 360`. The expand edit may have been lost between sessions. Verify visually whether the arc needs expanding.
2. **Progress arc tip indicator** — a small glowing dot at the current time position (playhead) not added yet.
3. **Color theming** — arc is all white on dark; warm gold/amber for progress arc might look better.
4. **Responsive / embed mode** — not yet done; could iframe into other pages.
5. **Zone selector styling polish** — `sizeSelect()` uses canvas font string `'11px Inter, system-ui, sans-serif'` which may differ slightly from actual rendered font in some browsers, causing minor width inaccuracies. A hidden `<span>` measuring approach would be more precise if this becomes an issue.
6. **GPS auto-detection** — not implemented in this widget (the main `jadual-waktu/` app has it). Could be added.

---

## User style notes

- Works iteratively with screenshots — small visual adjustments one at a time
- Prefers direct changes without lengthy explanation
- Malay prayer time names: Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak
- Dark theme: `#161b22` background, white text/strokes
- No frameworks, no build step — pure vanilla JS/HTML/CSS
- Language preference in UI: Malay (`lang="ms"`)
