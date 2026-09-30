# DEV_NOTES — Handoff to Next Window

> Date: 1 Oct 2026 (~00:00–01:30 MYT, late-night build session)
> Repo: `multimedia-mamtj6-ramadan` → `ramadan.mamtj6.com` (Ramadan 2027 / 1448H)
> Last commit pushed: `ebd5d59` — everything pushed EXCEPT one fix (see §1).

---

## 1. READ THIS FIRST — uncommitted work in tree

`countdown/style.css` has **one uncommitted fix**: selector widened to
`.time-box.tick-pop, .days-display.tick-pop` (day-number pop was invisible —
see bug #4). Next window: smoke-test then `git add -A && git commit && git push`.
`.vscode/` is untracked local settings — leave it alone.

---

## 2. Vibe / headspace — sync to this frequency

- **Energy:** late-night, fast, approve-driven loop. Owner iterates visually and
  decides in one-liners: *"ok go"*, *"ok pop and glow"*, *"ok jam and minit"*.
  Don't over-explain — propose briefly, implement on approval, verify, report.
- **User dynamic:** terse messages, often one sentence + screenshot. Malay/English
  mix; reply in the same register (short, factual, no fluff). Uses screenshots as
  bug reports — read the image carefully, it usually contains the diagnosis.
- **Plan/Build toggling:** user switches between Plan mode (design discussion,
  NO file edits) and build mode mid-conversation, sometimes mid-turn. Watch for
  `<system-reminder>` blocks — they override everything. When they say "ok go"
  after planning, that's the green light.
- **Staged approvals are real:** e.g. "apply 2x first, after i approve then move
  to animation. but dont remove saat" — partial scope + explicit constraint in one
  breath. Honor the constraint literally (we kept all 3 rings).
- **Trust pattern:** user approves fast because verification is shown every time
  (`node --check`, grep counts, simulated outputs). Never skip the receipt.

## 3. What this session built (chronological)

1. **Resumed** post-`ee04b75` (2027 rollover). Working tree clean.
2. **User renamed all 8 template PNGs** (`template-hijri.png` →
   `hijri-before-rejab.png` etc.) → updated `script.js` to match via new
   `templateFiles` map + `templatePath(kind)`, synced `ramadan-config.json/.md`,
   `countdown/readme.md`. Verified all 8 paths exist.
3. **Fixed total page freeze** ("Memuatkan waktu sasaran..." stuck) — TDZ bug.
4. **Masihi tab went live** (was days-only static; now ticks like Hijri).
5. **Simulated test clock** — `?testDate` now drives numbers (it didn't!),
   new `?testTime=HH:MM`, worldtimeapi skipped in test mode.
6. **Rings 2×** (80→160px via `viewBox` + clamp), then made **conditional**:
   80px normally, 2× only when `days === 0` (`.final-day` class).
7. **Flip pulse+glow** (`.tick-pop`): minutes → +hours → +days, seconds excluded.

## 4. Bugs found & fixed — and how to never repeat them

| # | Bug | Symptom | Root cause | Fix |
|---|-----|---------|-----------|-----|
| 1 | `timeOffset` TDZ | Whole page frozen at loading text | `let effectiveDate = …timeOffset` (line ~54) ran **before** `let timeOffset = 0` (line ~77). `let` TDZ throws, killing the entire `DOMContentLoaded` handler silently (console-only error) | Moved declaration above first use |
| 2 | Template 404 after rename | Export PNG would fail | Code hardcoded `template-*.png`; user renamed files | `templateFiles` map in code + `ramadan-config.json` (single source) |
| 3 | (Caught pre-ship) `masihiElements` referenced `masihiPanel` before its `const` | Would have been bug #1 all over again | Element map defined above DOM section | Moved map below DOM section |
| 4 | Day-number pop invisible | Rings popped, big number didn't | CSS `.time-box.tick-pop` never matches `.days-display` div | Selector → `.time-box.tick-pop, .days-display.tick-pop` |

**Learnings (anti-recurrence rules):**
- **TDZ is the #1 killer in this codebase.** Single big `DOMContentLoaded` closure
  + `let`/`const` = one misordered line freezes the whole app with zero on-page
  signal. Rule: *declare all shared state at the very top; define element maps
  only after the DOM section; after any reorder, `node --check` + open console.*
- **When JS toggles a class, grep the CSS selector against the actual element's
  class list.** Bug #4 passed syntax checks and code review — only a
  selector-vs-DOM cross-check catches it.
- **Keep asset names in config, not literals.** Any rename must be verifiable:
  loop `templateFolders × templateFiles` and assert existence (we did via PS).
- **SVG without `viewBox` won't CSS-scale** — it just adds empty space. Always
  include `viewBox="0 0 80 80"` on ring SVGs.
- **3-ring mobile fit:** each ring ≤ `(100vw − gaps)/3` → `clamp(96px, 28vw, 160px)`
  fits 320px screens. Recompute if ring count or gap changes.
- **Inherent (document, don't fix):** 1→0 day flip hides the number the same
  instant, so its pop is invisible by design; `?testDate` without `?testTime`
  means midnight sharp (floor-boundary flips land ~1s after sim midnight).

## 5. Test URLs (all verified this session)

```
countdown/?testDate=2026-12-17          # sim numbers: Masihi 53h, Hijri 52d 19:28
countdown/?testDate=2027-02-07&testTime=18:00   # final-evening tick to Maghrib
countdown/?testDate=2027-02-07&testTime=23:59   # midnight: finale ring grow + triple-pop
countdown/?testDate=2027-02-05&testTime=23:59   # visible day flip 2→1 (~61s wait)
countdown/?debug=1                      # sim datetime + template paths panel
```

## 6. Open threads for next window

- Commit + push the `style.css` day-pop selector fix.
- User may next ask for export-PNG parity with new rings (export uses day number
  only — flag if they expect rings in the PNG).
- 2027 provisional dates still pending JAKIM announcement (see `MAINTENANCE.md`
  TODO 2027-recheck; `ramadan-config.json` carries the TODO notes).
- Gentler day-pop variant (scale 1.04, no glow) was offered but not requested —
  only revisit if user says the big-number pop looks too dramatic.
