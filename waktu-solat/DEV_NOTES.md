# Session Handoff — waktu-solat/simple.html

the prompt:
"Check the Project Knowledge and the current chat for context. This conversation is ending soon. update the artifact DEV_NOTES.md (create if not available yet) with a detailed note to your next window self - not just facts but the vibe, our dynamic, the energy of this conversation. What would the next you need to immediately get back into this exact headspace? Include unique discoveries, current mood, and anything that'll help the next you instantly sync to our frequency."

**Last updated:** 2026-06-13 (Session 7)
**File being worked on:** Session 7 was the first session to spend real time on
**`waktu-solat/index.html`** (the multi-zone schedule table page), not just
`simple.html`. `simple.html` is still the polished arc widget described below —
but as of Session 7 it's no longer ONLY a standalone/Google-Sites widget, it's
also embedded INSIDE `index.html`. Keep both files in your mental model now.

---

## Vibe / dynamic check for Session 7 (most recent — read this first)

This was a **"zoom out to the bigger page" session** — after Sessions 1-6 polished
`simple.html` itself (arc, icons, embed mode, theming) to the point the user
declared it basically done, this session's energy was "ok, now go use it." Three
asks, each one a step further from `simple.html` in isolation:

1. **Opened with a verbal status check, not a question**: "i think major
   development already complete for the simple.html ... my next plan is to
   include the simple.html as embeded on the index.html .. the zone selector
   that used on the page will still works, but it will change the link path
   ?zone= according what user want. i think the existing INFO HARI INI card will
   be removed" — this read as half-decision, half-thinking-out-loud. Treated it
   as a plan-mode trigger (structural, multi-file, touches both HTML structure
   and a lot of dead-code removal). Good call — there WERE real open questions
   buried in "i think", surfaced via AskUserQuestion:
   - Whether the Countdown Section (timer + progress bar) should ALSO go, not
     just "INFO HARI INI" → user said **"Remove both (Recommended)"**.
   - How the embedded `simple.html`'s OWN internal zone selector should behave
     when nested inside `index.html` (which has its own selector) → user gave a
     **free-text answer with reasoning**, not just a preset pick: "hide it on
     embeded mode if had ?selector=hide to hide the zone selector. because the
     simple.html will be used on elsewhere" — i.e. don't piggyback on `?embed=1`,
     make a NEW independent opt-in param, because `simple.html` standalone
     embeds (Google Sites etc.) still want their own selector visible.
   This second answer is the kind of thing to re-read carefully — it's a small
   sentence carrying a real architectural constraint (separation of `?embed=1`
   vs `?selector=hide`), and it came with the "why" already attached.

2. **Plan executed cleanly, no surprises**: added `?selector=hide` +
   `.hide-selector` CSS to `simple.html`; gutted `index.html`'s INFO HARI INI +
   Countdown Section (HTML/CSS/JS — a LOT of dead code: `globalPrayerTimes`,
   `lastMaghrib`, `startCountdown`, `highlightNextPrayer`, `setupCountdown`, the
   60s transition-checker `setInterval`, the whole next-month fetch that only
   existed to feed tomorrow's countdown); replaced with a `.prayer-widget-embed`
   iframe wrapper pointing at `simple.html?embed=1&selector=hide&zone=...`, wired
   to `#zone-select`'s existing change handler + GPS detection + initial load via
   one new `updatePrayerWidgetFrame(zoneCode)` helper. Kept `isToday()` and
   `calculateImsak()` — still drive the schedule table's "today" row and Imsak
   column. Verified via Node `new Function()` syntax-check on extracted
   `<script>` blocks (no Playwright/browser tool available in this env — checked
   via ToolSearch, confirmed absent, didn't fight it, just used what's available).

3. **Then two quick, low-ceremony polish asks** — back to the Session 5-style
   "just do it" energy after the plan-mode chunk landed:
   - "if the zone selector is hidden, make the date text centered" → one CSS
     rule: `body.hide-selector .top-bar { justify-content: center; }`. Because
     `.top-bar` is `justify-content: space-between` with two children
     (`.location-bar` + `.footer-bar`), hiding the first child via
     `display:none` leaves the date pinned to one side under `space-between` —
     centering the row is the fix, not touching `.footer-bar` itself.
   - **"this index.html not tied with ramadan, chang all text that related with
     ramadan (title etc)"** — a de-branding pass. Grepped for `Ramadan`, found it
     in `<title>`, `apple-mobile-web-app-title`, OG/Twitter meta, `<h1>`, and the
     infaq description ("Program Ihya' Ramadan..."), PLUS a Hijri-month-names
     array (`"Ramadan", "Syawal", ...`) — **that last one is a real calendar month
     name, NOT branding, left untouched**. Asked ONE clarifying question (via
     AskUserQuestion) specifically about the infaq text, because it names an
     actual program — user said **"Generalize it"**, so it became a plain
     "support the masjid" message instead of "Program Ihya' Ramadan". Deliberately
     did NOT touch `og:url`/`og:image` (`ramadan.mamtj6.com/...` paths) — those
     are real hosting URLs from the root CLAUDE.md, not display branding; changing
     them is an infra decision, out of scope for a "fix the text" ask.

**Energy**: this session felt like the project graduating from "polish one
widget" to "assemble the page out of widgets" — bigger diffs (lots of dead-code
deletion) but LOW anxiety, because the plan was approved upfront and each removal
was clearly justified by the embed replacing it. The two tail asks were classic
Session-5-style one-liners — don't over-think small CSS/text asks just because
they come right after a big structural plan; match ceremony to ambiguity, not to
recency of a big task.

**State of the world going into next session**:
- `index.html` no longer has its own countdown/progress-bar/info-card — that's
  ALL delegated to the embedded `simple.html` iframe now. If asked to change
  countdown/progress-bar behavior, the edit almost certainly belongs in
  `simple.html`, not `index.html`.
- `index.html` is de-branded from "Ramadan 2026" → generic "Jadual Waktu Solat".
  If you see "Ramadan" reappear in a future ask for `index.html`, that's likely
  intentional/new context, not a regression to "fix back".
- `simple.html` now has THREE url params controlling its chrome:
  `?embed=1` (transparent page bg + scale-to-fit, for Google Sites),
  `?selector=hide` (hide its own zone dropdown, independent of embed),
  `?zone=`/`?testTime=`/`?testDate=` (existing). `index.html`'s iframe passes
  `embed=1&selector=hide&zone=<code>` + `testTime` passthrough.
- `.prayer-widget-embed` container uses `aspect-ratio: 480/300` — flagged as
  "refine during verification" in the plan, never actually visually verified
  (no browser tool). If the embedded widget looks clipped/has dead space in
  `index.html`, start here.
- Known issues list for `simple.html` itself (color theming, GPS auto-detection)
  is UNCHANGED — still sitting there, still valid candidates for "next big ask",
  but as ever, just read what's thrown at you.

---

## Vibe / dynamic check for Session 6 (read this next)

This was the **embed-mode polish session** — a direct continuation of Session 4's
`?embed=1` feature, but it turned out Session 4's embed CSS was only "good enough
on desktop." The whole session was a chain of "looks fine here, but..." discoveries,
each one peeling back a layer:

1. User: "the prevent-scroll works perfectly, but the embedded width is not wide
   enough" — opened with a working baseline + one specific complaint. Recreated
   `embed_test.html` as a 360x400 red-bordered iframe test harness (this file is
   throwaway/scratch — expect it to keep getting hand-edited by the user between
   sessions, don't be surprised by odd dimensions or stale `<p>` text in it).
2. Fixed width-fill with an **iterative widen-then-scale algorithm** in
   `scaleEmbedToFit()` + `transform-origin: top left` (was `top center`). This is
   the kind of fix that *sounds* overengineered for a one-file widget but isn't —
   the math (geometric convergence, `Hc > Wc/3` condition) is real and documented
   in the new guide file (see below). Don't simplify it back to a single-pass
   `Math.min()` scale — that's literally the bug that was just fixed.
3. User then hit confusing intermediate states: "why is the red box tall, and
   editing the iframe height does nothing?" — turned out to be (a) a CSS typo
   (`height: 400x` — invalid unit, Edit D) and (b) plain browser caching (told
   user to hard-refresh). **Lesson**: when the user says "I edited X and nothing
   happened" on a local static file, caching is the first suspect, not logic.
4. The big one: user sent **two screenshots** (desktop vs. mobile, live on
   `ramadan.mamtj6.com` via Google Sites) — desktop embed "works great", mobile
   embed was narrow and left-aligned. Root cause: `max-width: 100%` on
   `body.embed-mode .widget` was silently clamping the JS's intentional
   over-widening (`widget.style.width = containerWidth/scale` when `scale < 1`).
   Desktop never triggers `scale < 1` (so the cap never binds, bug invisible
   there) — **mobile-aspect iframes (short relative to width) are what expose
   this class of bug.** Fixed with `max-width: none`. THIS WAS THE LAST EDIT —
   applied but not yet re-verified by the user when the summary was written.
5. Session continued past that point (per the user's final message: "the
   embedded functionality is working now") — so **the `max-width: none` fix is
   CONFIRMED WORKING**. Embed mode for `simple.html` is now considered done.
6. Final ask of the session: write up everything learned as a standalone guide —
   `waktu-solat/gsites_embeded_guide.md` was created, covering the embed pattern,
   the scale-to-fit algorithm + convergence math, the max-width trap, and a
   comparison with `test_file.html`'s simpler centered `scaleToFit()`. **If you're
   ever asked to embed ANOTHER widget into Google Sites, read that guide FIRST**
   — it's written specifically to prevent re-deriving this session's discoveries.

**Energy**: investigative, screenshot-driven debugging — the user is good at
spotting "this looks subtly wrong" from screenshots and handing you the visual
evidence; trust those screenshots over "the code looks right to me." Low-ceremony
otherwise — direct fixes, no big plan-mode ceremony needed except for the final
"write a guide" ask (which only needed plan mode because of the
write-outside-plan-file restriction, not because the task itself was ambiguous).

**State of the world going into next session**: embed mode is DONE and CONFIRMED.
Known issues list (color theming, GPS auto-detection) is unchanged — still the
two most likely "next big ask" candidates, but as always, just read what's thrown
at you.

---

## Vibe / dynamic check for Session 5 (previous)

Short, punchy session — three asks, each smaller/different in shape than the last,
all landed clean. Same low-ceremony energy as Session 3, plus one good "look at the
screenshot, find the REAL bug" moment.

**Opened with closure**: user said "both are working now" (re: Session 3's two open
items — top-bar layout and the Syuruk-highlight edge case). Both verified live by
user, no further action — just removed from the known-issues list. Good reminder:
when the user confirms something works, trust it and move the known-issue off the
list immediately, don't ask "are you sure" or re-verify yourself.

**Then escalating asks**:
1. "explain" (selected the "progress arc tip indicator" known-issue line) → gave a
   plain-language explanation of what a "playhead" dot is (a glowing dot tracking
   "now" along the arc, distinct from the fixed prayer-time dots). User: "ok add it" —
   implemented immediately, zero further discussion.
2. "make the halo smaller" → one-line tweak (`r="7"` → `r="5"`), done in seconds.
3. "Responsive / embed mode" (the last known-issue item) — user explicitly invoked
   **plan mode** for this one (first time on this project). Went through full
   Explore → AskUserQuestion (clarified scope: BOTH `?embed=1` chrome-strip AND
   320px-width responsiveness; target 320px not 280px) → Plan agent → approved
   plan → implementation. Plan mode earned its keep here because the ask had real
   unresolved design questions ("what does 'embed' even mean for THIS widget?").
   Contrast with asks #1-2 above, which needed zero ceremony — match the ceremony
   to the ambiguity, not to the size of the diff.

**Then a live bug, handled well**: user pasted a real `ramadan.mamtj6.com` URL with
`?zone=PHG03&?embed=1` (note the double `?`) and said "the embeded still not work".
First instinct was the malformed URL — and that WAS technically broken (`?embed`
becomes a literal param key, not `embed`, so `params.get('embed')` returned null).
But the user then sent a **screenshot** showing the real problem: with the correct
param, embed mode kicked in but the ENTIRE widget went invisible except a pink pin
emoji and one black-filled dot, floating on white. Root cause: embed mode had set
`.widget`'s background to `transparent`, but every label/stroke/icon in this widget
is white-on-`#161b22` — on a white host page that's white-on-white. Fixed by keeping
`.widget`'s own dark card background in embed mode; only the page-level chrome
(shadow/radius/max-width/centering) gets stripped, not the card's own background.

**Key lesson for next-you**: this widget's entire visual language assumes a dark
card. "Transparent embed" for a white-on-dark widget means "transparent PAGE,
opaque CARD" — not "transparent everything". If known-issue #1 (color theming /
light variant) ever gets picked up, that's the moment to revisit whether embed mode
should offer a true transparent/light option too — right now it can't, by design.

**Process note**: for the screenshot bug, the fix was verified by actually
re-screenshotting via a throwaway Playwright script (launched a local http.server,
loaded `?embed=1&testTime=18:30` at 400x400, screenshotted on a white page) before
declaring it fixed — don't skip the "look at a fresh screenshot" step for visual bugs,
a code-level "this should work now" isn't enough when the bug WAS visual.

**Energy**: terse, confirmatory, low-ceremony — same as Session 3. State what changed,
invite testing, don't over-explain. Known issues list is down to just 2 items now
(color theming, GPS auto-detection) — this widget is close to "done" for now; next
session is more likely to be a fresh visual nitpick or the color-theming item than
a big structural ask, but don't assume — just read what they throw at you.

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
  Subuh:   'wb_twilight_2',
  Syuruk:  'wb_twilight',
  Duha:    'wb_twilight',
  Zohor:   'sunny',
  Asar:    'partly_cloudy_day',
  Maghrib: 'wb_twilight',
  Isyak:   'bedtime',
};
```

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

**STATUS: confirmed working by user in Session 4** — no further action needed.

---

## Session 4 changes (this session)

### 1. Progress arc "tip" indicator (playhead dot)
New helper near `progressArcPath`:
```js
// Point on the arc at progress t (clamped [0,1]) — used to place the progress tip indicator.
function arcPointAtT(rawT) {
  const t = Math.max(0, Math.min(1, rawT));
  const x = ARC_PAD_X + (ARC_W - 2 * ARC_PAD_X) * t;
  return { x, y: arcY(x) };
}
```
In `buildArcSvg()`, two circles added right after `#progressArc`:
- `#progressTipGlow` — halo, `r="5"` (started at `7`, user asked to shrink), `fill="rgba(255,255,255,0.25)"`
- `#progressTip` — dot, `r="3"`, `fill="#ffffff"`

Both positioned via `arcPointAtT(initT)` on initial build. In `tick()`, both are
re-positioned every second alongside `#progressArc`, using
`arcPointAtT(rawT < 0 ? 1 : rawT)` (same clamping as `progressArcPath`).

### 2. Embed mode (`?embed=1`) + 320px responsive breakpoint
New IIFE after `initTestTime`:
```js
(function initEmbedMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('embed') === '1') {
    document.body.classList.add('embed-mode');
  }
})();
```

CSS:
```css
body.embed-mode {
  background: transparent;
  display: block;
  justify-content: initial;
  align-items: initial;
  min-height: 0;
  padding: 0;
}

body.embed-mode .widget {
  /* deliberately NO background override — widget keeps its #161b22 card bg.
     Every label/icon/stroke is white-on-dark; a transparent card on a white
     host page becomes invisible. "Embed" = transparent PAGE, opaque CARD. */
  border-radius: 0;
  box-shadow: none;
  max-width: 100%;
  width: 100%;
  min-height: 100%;
}
```

Plus a `@media (max-width: 360px)` block: shrinks `.widget` padding (22/20/16 →
16/12/12), reduces `.top-bar`/`.info-bar` gaps and font-sizes, and removes
`.info-side { min-width: 60px }` so `.countdown-block` (flex:1) keeps display
priority. The SVG arc itself needed NO changes — `viewBox="0 0 360 120"` scaling
means geometry, label offsets, and the `< 50`-unit collision thresholds are all
scale-invariant.

**Usage**: `simple.html?embed=1`, or combined e.g.
`simple.html?zone=JHR01&embed=1&testTime=18:30`.
**Gotcha**: correct syntax is `&embed=1` — NOT `&?embed=1` (a stray second `?`
makes `?embed` part of the param NAME, so `params.get('embed')` returns `null`).

---

## Session 6 changes (this session) — embed mode polish, now DONE

Builds on Session 4's `?embed=1`. Full writeup with diagrams/math in the new
**`waktu-solat/gsites_embeded_guide.md`** — read that first if revisiting embed
behavior. Summary of code changes:

### 1. `body.embed-mode .widget` CSS — two changes from Session 4
```css
body.embed-mode .widget {
  border-radius: 0;
  box-shadow: none;
  max-width: none;          /* was: max-width: 100% — this clamped the JS's
                                intentional over-widening, see #2 below */
  width: 100%;
  min-height: 100%;
  transform-origin: top left; /* was: top center (default) */
}
```

### 2. `scaleEmbedToFit()` — new function, called on render + resize
Shrinks `.widget` via `transform: scale()` so it fits the iframe height with no
scroll, AND fills the iframe width with no side margins (previously it would
shrink-and-center, leaving gaps). Iteratively widens the widget before scaling
down so the post-scale result lands exactly at `containerWidth`:
```js
function scaleEmbedToFit() {
  if (!document.body.classList.contains('embed-mode')) return;
  const widget = document.querySelector('.widget');
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  let scale = 1;
  for (let i = 0; i < 5; i++) {
    widget.style.transform = 'none';
    widget.style.width = (containerWidth / scale) + 'px';
    const naturalHeight = widget.offsetHeight;
    const next = Math.min(1, containerHeight / naturalHeight);
    if (Math.abs(next - scale) < 0.005) { scale = next; break; }
    scale = next;
  }

  widget.style.transform = `scale(${scale})`;
}
```
Called at the end of `renderArc()` and on `window.resize` (registered inside
`initEmbedMode()`'s IIFE, only when `embed=1`).

### 3. New test harness: `waktu-solat/embed_test.html`
Throwaway scratch file — a single `<iframe src="simple.html?embed=1&testTime=18:30">`
in a red-bordered box. Dimensions get hand-edited by the user for different test
cases (desktop-aspect vs. mobile-aspect). Expect it to be in an inconsistent state
between sessions (e.g. stale `<p>` text describing old dimensions) — that's normal,
not a bug to fix unless asked.

### 4. New reference doc: `waktu-solat/gsites_embeded_guide.md`
Standalone guide for embedding ANY widget into Google Sites — the `?embed=1`
pattern, the scale-to-fit algorithm + why it converges, the `max-width` trap, and
the testing checklist (always test a mobile-aspect iframe, not just desktop).

**STATUS: confirmed working by user — "the embedded functionality is working
now". Embed mode for `simple.html` is done.**

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
