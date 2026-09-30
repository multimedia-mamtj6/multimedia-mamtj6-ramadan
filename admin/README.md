# Admin Docs — `admin/`

Handoff and maintenance notes for the `multimedia-mamtj6-ramadan` project
(`ramadan.mamtj6.com`, Ramadan 2027 / 1448H).

| File | Purpose |
|------|---------|
| `DEV_NOTES.md` | **Start here.** Session handoff: vibe, user dynamic, bugs fixed + learnings, uncommitted state, test URLs, open threads. Updated at the end of each work session. |
| `CLAUDE.md` | Guidance for AI assistants working in this repo (conventions, gotchas, verification habits). |

Related docs outside `admin/`:

- `/CLAUDE.md` — repo architecture overview
- `/MAINTENANCE.md` — yearly rollover checklist (source of truth for dates)
- `/ramadan-config.json` + `/ramadan-config.md` — single shared config + parameter reference
- `countdown/CLAUDE.md`, `jadual-waktu/CLAUDE.md`, `jadual-waktu/developer.md` — per-app details

> No `database.md`: this is a fully static site (vanilla HTML/CSS/JS, no backend,
> no database). External data comes from live APIs documented in `/CLAUDE.md`
> (`worldtimeapi.org`, `api.waktusolat.app`). No `developer.md` here either —
> per-app developer docs already live alongside their apps (see table above).
