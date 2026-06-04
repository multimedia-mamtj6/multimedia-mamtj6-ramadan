# Session Handoff — waktu-solat/simple.html

**Date:** 2026-06-05  
**File being worked on:** `waktu-solat/simple.html` — a self-contained dark-mode prayer times widget (single HTML file, no build step, vanilla JS + SVG).

---

## What this file is

A standalone widget that:
- Fetches today's prayer times for a hardcoded zone (`PHG03` — Pahang · Temerloh)
- Draws a quadratic bezier arc in SVG with 6 prayer dots (Subuh → Syuruk → Zohor → Asar → Maghrib → Isyak)
- Shows time labels and prayer name labels under each dot
- Displays a live countdown timer and info bar (current prayer / next prayer)
- Progress bar arc grows from Subuh to current time as the day advances
- Current prayer dot pulses with a ripple ring animation

---

## Current arc geometry constants

```js
const ARC_W      = 440;      // SVG coordinate width (expanded from 360 this session)
const ARC_PAD_X  = 20;       // arc path endpoint inset from edges
const DOT_PAD_X  = ARC_PAD_X; // = 20; Subuh dot at x=20, Isyak dot at x=420
const ARC_TOP_Y  = 14;       // arc peak y (top of the arc)
const ARC_BOT_Y  = 70;       // arc endpoint y (bottom, where Subuh/Isyak sit)
const CTRL_Y     = 2 * ARC_TOP_Y - ARC_BOT_Y; // = -42 (bezier control point — may be off-screen)
const VIEW_H     = 120;      // SVG viewBox height
```

Arc path: `M 20,70 Q 220,-42 420,70`

**Critical invariant:** `CTRL_Y = 2*ARC_TOP_Y - ARC_BOT_Y` MUST hold so that `arcY(x)` formula matches the actual bezier path exactly. Never change one without updating the other.

---

## Key functions

```js
timeToX(tsMs)      // maps prayer Unix-ms timestamp → SVG x (DOT_PAD_X to ARC_W-DOT_PAD_X)
arcY(x)            // maps SVG x → y position on the bezier arc
progressArcPath(t) // de Casteljau bezier split at t∈[0,1]; returns SVG path string for elapsed portion
startPulseAnimation() // rAF loop: animates #pulseRing r (6→17) and opacity (0.7→0) over 1800ms
buildArcSvg()      // builds entire SVG; returns { svg, currentIdx, displayCurrentIdx, nextIdx }
renderArc()        // inserts SVG into DOM, starts pulse, starts countdown tick()
tick()             // runs every second: updates countdown display + advances #progressArc path
```

---

## Architecture decisions made this session

### Label collision fix
Syuruk sits ~27 SVG units from Subuh (left endpoint), Maghrib sits ~27 SVG units from Isyak (right endpoint). The arc's natural geometry already places inner dots (y≈53) ~17px ABOVE the endpoints (y=70). **No y-bump is needed** — horizontal text-anchor divergence is enough:

- `isCloseToPrev` → anchor = `'start'` (Syuruk labels start at its x, going right)
- `isCloseToNext` → anchor = `'end'` (Maghrib labels end at its x, going left)
- Subuh: `anchor='start'`, `labelX = x - 10` (shifted left by 10)
- Isyak: `anchor='end'`, `labelX = x + 10` (shifted right by 10)

**Past mistake to avoid:** A `yBump` was tried (pushing inner dots' labels downward) but it accidentally pushed Syuruk labels to the SAME y as Subuh labels (since Syuruk is naturally 17px higher, yBump=18 exactly cancelled that gap). The fix was removing yBump entirely.

### Progress arc (de Casteljau subdivision)
The bezier is split at parameter `t = (now - fajr) / (isha - fajr)`:

```js
const P01  = lerp(P0, P1, t)
const P12  = lerp(P1, P2, t)
const Pmid = lerp(P01, P12, t)
// Elapsed arc: M P0 Q P01 Pmid
```

**Post-midnight edge case:** Before Subuh today (`now < fajrTs`), `rawT` is negative. Fix: `rawT < 0 ? 1 : rawT` — show full arc (all prayers completed from yesterday's cycle). Applied in both `buildArcSvg()` initial draw and `tick()` update.

### currentIdx vs displayCurrentIdx
```js
let currentIdx = -1;
prayerList.forEach((p, i) => { if (now >= p.ts) currentIdx = i; });
const displayCurrentIdx = currentIdx >= 0 ? currentIdx : prayerList.length - 1;
```

- `currentIdx`: the actual last-passed prayer index; `-1` before Subuh
- `displayCurrentIdx`: what dot to visually highlight as "current"; falls back to Isyak (last) before Subuh, so the Isyak dot pulses through the night correctly
- `isNext = i === nextIdx && currentIdx >= 0` — suppress "next" highlight before Subuh (avoids Subuh appearing bright-white filled when it's actually just upcoming)

### Pulse animation
CSS `transform: scale()` and SMIL `<animate>` both failed/were unreliable. Current solution: `requestAnimationFrame` loop directly sets `r` and `opacity` attributes on `#pulseRing` element every frame. Stops itself if element is removed (on re-render).

```js
function startPulseAnimation() {
  const BASE = 6, MAX = 17, DUR = 1800;
  function frame(ts) {
    const el = document.getElementById('pulseRing');
    if (!el) { pulseAnimId = null; return; } // stops when SVG is rebuilt
    const t = (ts % DUR) / DUR;
    el.setAttribute('r', (BASE + (MAX - BASE) * t).toFixed(1));
    el.setAttribute('opacity', (0.7 * (1 - t)).toFixed(3));
    pulseAnimId = requestAnimationFrame(frame);
  }
  pulseAnimId = requestAnimationFrame(frame);
}
```

---

## Current visual spec

| Layer | stroke | stroke-width | opacity |
|---|---|---|---|
| Background arc (full) | white | 2 | 0.15 |
| Progress arc (elapsed) | white | 4 | 0.85 |
| Current dot (isCurrent) | white | 2.5 | — (fill = #161b22) |
| Pulse ring | white | 1.5 | 0.7→0 animated |
| Past dot | white | 1.5 | fill 0.15, stroke 0.4 |
| Next dot | white | 1.5 | fill 0.95 |
| Future dot | white | 1.5 | fill 0.5 |

Label `timeOffset = r + 13`, `nameOffset = timeOffset + 11`

---

## Things NOT yet done / possible next steps

The session ended without explicit next tasks. Possible things the user might want:

1. **Zone selector** — currently hardcoded to `PHG03`. Could add a dropdown or URL param `?zone=XXX` like the main `jadual-waktu/` app does.
2. **Responsive / embed mode** — widget is self-contained, could be iframed into other pages.
3. **Label fine-tuning** — user has been iteratively adjusting label positions; more tweaks possible.
4. **Progress arc tip indicator** — a small glowing dot at the current time position on the arc (the "playhead") wasn't added.
5. **Color theming** — arc is all white on dark right now; a warm color (gold/amber) for the progress arc might look nice.
6. **Testing at other times of day** — use `?testTime=HH:MM` URL param to verify behavior at Subuh, Zohor, etc.
7. **Widget integration** — this `simple.html` might be intended to be embedded in other pages of the project.

---

## User style notes

- Works iteratively with screenshots — makes small visual adjustments one at a time
- Prefers direct changes without lengthy explanation
- Uses Malay language for prayer time names (Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak)
- Dark theme (`#161b22` background, white text/strokes)
- No frameworks, no build step — pure vanilla JS/HTML/CSS
