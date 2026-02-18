# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static web application collection for Ramadan 2026 (1447H) targeting Malaysian audience. Contains multiple interconnected apps:

- **countdown/** - Hijri/Gregorian countdown to Ramadan with image export
- **jadual-waktu/** - Prayer times scheduler for 61 Malaysian zones (JAKIM data)
- **telegram_reminder/** - Google Apps Script for automated Telegram countdown bot
- **info/** - Additional prayer schedule pages
- **pwa-test/** - PWA testing directory

**Tech Stack**: Vanilla JavaScript, HTML5, CSS3 (no frameworks, no build step)
**Deployment**: Vercel with `trailingSlash: true`
**Domain**: ramadan.mamtj6.com
**Language**: Primarily Malay (lang="ms")

## Development Commands

No build step required - static files served directly.

```bash
# Run locally (any method)
python -m http.server 8000
npx serve
# Or use VS Code Live Server extension

# Test with URL parameters
index.html?location=JHR01              # Prayer zone
index.html?testDate=2026-02-20         # Test date for countdown
```

### Service Worker Updates (countdown/)
1. Update `CACHE_NAME` version in `sw.js` (line 3)
2. Update version display in `index.html` (line 144)
3. Hard refresh browser: `Ctrl+Shift+R`

## Architecture

### Countdown App (countdown/)
- **Dual Display**: Hijri (default) and Masihi tabs showing different countdown modes
- **Time Sync**: Single API call to worldtimeapi.org, calculates offset for accuracy
- **Image Export**: HTML5 Canvas with `textBaseline: 'middle'` for cross-browser text alignment
- **PWA**: Cache-first service worker with update notifications

### Prayer Times App (jadual-waktu/)
- **Single-File**: All CSS/JS embedded in HTML (no external files)
- **Zone Persistence**: localStorage (`selectedZone`) + URL parameter override
- **Real-time Countdown**: Auto-switches between berbuka and next Imsak
- **Dual Views**: Desktop table + mobile cards
- **API**: Fetches from `api.waktusolat.app` (JAKIM data source)

### Telegram Automation (telegram_reminder/)
- Google Apps Script scheduled at 9:05 AM Malaysia time
- Uses Google Slides as template engine for dynamic image generation
- Placeholder: `{{countdown_number}}` replaced with current countdown

## Key Constants

**Ramadan 2026 Dates (hardcoded)**:
- Start: 19 February 2026 (1 Ramadan 1447H)
- End: 20 March 2026 (30 Ramadan 1447H)
- Countdown Target: 18 February 2026, 7:29 PM (Maghrib KL)

**CSS/UI**:
- Circular progress uses CIRCUMFERENCE = 220 for stroke-dashoffset
- Prayer times: green/white theme
- Countdown: blue/orange theme

## External Dependencies (CDN/API)

- Google Fonts: Merriweather (countdown), Google Sans (jadual-waktu)
- World Time API: `worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur`
- Prayer Times API: `api.waktusolat.app`
- MST SIRIM Widget (jadual-waktu info page)

## Subdirectory Documentation

Detailed technical docs exist in subdirectories:
- `countdown/CLAUDE.md` - Countdown app specifics
- `jadual-waktu/CLAUDE.md` - Prayer times app specifics
- `jadual-waktu/developer.md` - API integration details
