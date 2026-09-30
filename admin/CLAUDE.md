# CLAUDE.md — Admin / Handoff Conventions

Guidance for AI assistants working in this repo. Read with `/CLAUDE.md`
(architecture) and `admin/DEV_NOTES.md` (latest session state).

## Communication

- Owner decides in one-liners (*"ok go"*). Keep replies short, factual, no filler.
- Bug reports often arrive as a single sentence + screenshot — read the image.
- Propose → approve → implement → **show verification receipts** (`node --check`,
  grep counts, simulated outputs). Receipts are why approvals come fast.
- Respect Plan mode `<system-reminder>` blocks absolutely; "ok go" = build.

## Gotchas (paid for in bugs — see DEV_NOTES §4)

1. **TDZ kills the whole app.** One `let` used before declaration inside the big
   `DOMContentLoaded` closure freezes the page with only a console error.
   Declare shared state at top; element maps after the DOM section.
2. **Class toggles need selector cross-checks.** After adding a JS-driven class,
   grep the CSS selector against the target element's real class list.
3. **Asset renames must update `templateFiles`** in `countdown/script.js` AND
   `/ramadan-config.json`, then assert all 8 paths exist on disk.
4. **Ring SVGs need `viewBox="0 0 80 80"`** or CSS scaling silently does nothing.
5. **3-ring mobile fit:** `clamp(96px, 28vw, 160px)` — recompute if ring count
   or gap changes.

## Workflow

- PWA is **off** (unregistered everywhere) — don't bump `CACHE_NAME`.
- Serve locally: `python -m http.server 8000`; hard-refresh (`Ctrl+Shift+R`).
- Test via `countdown/?testDate=…&testTime=…&debug=1` (see DEV_NOTES §5).
- Update `admin/DEV_NOTES.md` §1/§5/§6 at session end; commit + push on request.
- Leave `.vscode/` untracked. Yearly date changes go through `/MAINTENANCE.md`.
