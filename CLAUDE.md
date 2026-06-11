# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static web application collection for Ramadan 2026 (1447H) targeting Malaysian audience. Contains multiple interconnected apps:

- **countdown/** - Hijri/Gregorian countdown to Ramadan with image export and PWA
- **jadual-waktu/** - Prayer times scheduler for 61 Malaysian zones (JAKIM data) with PWA
- **telegram_reminder/** - Google Apps Script for automated Telegram countdown bot
- **info/** - Additional prayer schedule pages
- **waktu/** - Static per-zone prayer time pages

**Tech Stack**: Vanilla JavaScript, HTML5, CSS3 (no frameworks, no build step)
**Deployment**: Vercel with `trailingSlash: true`
**Domain**: ramadan.mamtj6.com
**Language**: Primarily Malay (lang="ms")

Note: The root `index.html` is a placeholder page only — all real apps live in subdirectories.

## Development Commands

No build step required - static files served directly.

```bash
# Run locally (any method)
python -m http.server 8000
npx serve

# Test with URL parameters (countdown)
countdown/index.html?testDate=2026-02-20

# Test with URL parameters (jadual-waktu)
jadual-waktu/index.html?location=JHR01
jadual-waktu/index.html?testDate=2026-02-20&testTime=18:30
```

### Service Worker Updates

Both `countdown/` and `jadual-waktu/` have PWA service workers. When changing any cached file in either app, bump the `CACHE_NAME` version and the version display together.

**countdown/** — two files must stay in sync:
1. `sw.js:3` — update `CACHE_NAME` (e.g., `ramadan-countdown-v1.4.5`)
2. `index.html:144` — update version display to match

**jadual-waktu/** — two files must stay in sync:
1. `asset/sw.js` (or embedded SW) — update `CACHE_NAME`
2. `index.html` version display

After bumping: hard refresh with `Ctrl+Shift+R` or clear DevTools cache.

## Architecture

### Countdown App (countdown/)

- **Dual Display**: Hijri (default) and Masihi tabs; tab state managed via CSS classes (`.active-panel`), no JS visibility logic
- **Time Sync**: Single call to `worldtimeapi.org` on load; calculates `timeOffset` applied to all `Date.now()` calls
- **Image Export**: `generateImage()` in `script.js:194`; loads 1080×1080 PNG template, renders text using `ctx.textBaseline = 'middle'` (required for Chrome/Safari cross-browser consistency)
- **PWA**: Cache-first service worker; template PNGs are excluded from cache and fetched fresh with a daily cache-bust query param

Key constants in `script.js`:
```js
const masihiTargetDate = new Date('2026-02-19T00:00:00');
const hijriTargetDate  = new Date('2026-02-18T19:29:00');
const CIRCUMFERENCE = 220; // SVG circle stroke-dashoffset
```

### Prayer Times App (jadual-waktu/)

- **Single-File**: All CSS and JS embedded in `index.html` — no external JS/CSS files
- **Zone Persistence**: `getSavedZone()` reads URL `?location=` first, then `localStorage('selectedZone')`, defaulting to `PHG03`
- **Data Flow**: On load → fetch zones → restore zone → fetch Feb & Mar 2026 prayer data in parallel → filter to Ramadan dates (Feb 19–Mar 20) → render → start countdown
- **Countdown Phases**: Pre-Fajr → imsak; Fajr to Maghrib → berbuka; post-Maghrib → tomorrow's imsak; auto-switches seamlessly
- **Progress Bar**: Uses `lastMaghrib` timestamp (from API via `isYesterday()`, persisted to `localStorage`) as start time for the pre-Fajr phase; values >24h old are discarded to prevent stale calculations
- **GPS Detection**: `detectZoneByGPS()` calls `navigator.geolocation` then `api.waktusolat.app/v2/solat/gps/{lat}/{long}`; runs automatically on first visit (no saved zone)

Key global variables:
```js
globalPrayerTimes = { today: { fajr, maghrib }, tomorrow: { fajr, maghrib } } // Unix ms
cachedZones = []        // Zone list from API
timeOffset = 0          // ms; set by ?testTime= param
countdownTimerId = null
```

localStorage keys:
| Key | Description |
|-----|-------------|
| `selectedZone` | Zone code (e.g., `PHG03`) |
| `lastMaghrib` | Yesterday's Maghrib Unix timestamp (ms); used for progress bar start |

### Telegram Automation (telegram_reminder/)

- Google Apps Script scheduled at 9:05 AM Malaysia time
- Uses Google Slides as template engine; placeholder `{{countdown_number}}` replaced with current countdown

## External APIs

| Service | URL | Used By |
|---------|-----|---------|
| World Time API | `worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur` | countdown/ |
| Prayer Times | `api.waktusolat.app/v2/solat/{zone}?year=&month=` | jadual-waktu/ |
| Zones List | `api.waktusolat.app/zones` | jadual-waktu/ |
| GPS Zone Lookup | `api.waktusolat.app/v2/solat/gps/{lat}/{long}` | jadual-waktu/ |

## Key Hardcoded Dates (update for future years)

- Ramadan Start: 19 February 2026 (1 Ramadan 1447H)
- Ramadan End: 20 March 2026 (30 Ramadan 1447H)
- Hijri countdown target: 18 February 2026, 7:29 PM KL Maghrib

## Subdirectory Documentation

More detailed technical docs in subdirectories:
- `countdown/CLAUDE.md` — countdown app architecture and implementation details
- `jadual-waktu/CLAUDE.md` — prayer times app feature list and function reference
- `jadual-waktu/developer.md` — API response shapes, function signatures, CSS classes, changelog
