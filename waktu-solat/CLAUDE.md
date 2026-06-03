# CLAUDE.md

**Version:** 1.5.4

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web project displaying Ramadan 2026 prayer times (waktu solat) for all zones in Malaysia. It shows Imsak, Subuh, and Berbuka times with a live countdown feature and zone selection.

## Architecture

**Main application** (`index.html`):
- Self-contained HTML with embedded CSS and JavaScript
- Fetches prayer data from `https://api.waktusolat.app/v2/solat/{zone}`
- Fetches zone list from `https://api.waktusolat.app/zones`
- Responsive design with separate desktop (table) and mobile (card) views
- Real-time countdown timer to next prayer time
- Zone selector dropdown with localStorage and URL persistence

**Info page** (`info.html`):
- Project information and documentation
- Sections with anchor links for sharing (e.g., `info.html#waktu`)
- MST SIRIM widget for time verification
- Infaq section with donation link

**Key JavaScript functions**:
- `loadZones()` - Fetches and populates zone dropdown, grouped by state
- `fetchData()` - Fetches prayer data for Feb & Mar 2026, renders both views
- `setupCountdown()` - Determines countdown target (berbuka or next day's imsak)
- `startCountdown()` - Manages the countdown timer with progress bar
- `updateZoneHeader(zone)` - Updates header with state name, zone number, and district
- `getSavedZone()` / `saveZone()` - localStorage and URL helpers for zone persistence
- `getTestDate()` - Returns test date/time from URL parameters or current date
- `getNow()` - Returns offset-adjusted current time (supports `testTime` URL param)
- `highlightNextPrayer()` - Highlights the next upcoming time box (Imsak/Subuh/Berbuka)
- `shareLink()` - Share/copy URL with zone info (state, code, district) in share text
- `detectZoneByGPS()` - Geolocation + GPS API to auto-detect zone; returns zone code or null
- `triggerGPSDetection()` - GPS button click handler; re-detects zone, saves, and reloads data; shows error toast on failure
- `showSimpleToast(message, type)` - Self-dismissing toast (3s) for simple feedback; type 'error' = red

**Data flow**:
1. On load: fetch zones list, populate dropdown, restore saved zone from URL or localStorage
2. Fetch Feb 2026 and Mar 2026 prayer data in parallel
3. Filter to Ramadan period (Feb 19 - Mar 20, 2026)
4. Format times to 12-hour format, render desktop table and mobile cards
5. Store today's times in `globalPrayerTimes` for countdown logic
6. Start countdown timer to next prayer event
7. Update URL with `?location={zoneCode}` when zone changes

## Development

Open `index.html` directly in a browser - no build step required.

**URL Parameters**:
- `?location={zoneCode}` - Load specific zone (e.g., `?location=JHR01`)
- `?testDate=YYYY-MM-DD` - Simulate specific date (e.g., `?testDate=2026-02-20`)
- `?testTime=HH:MM` - Simulate specific time, ticks forward (e.g., `?testTime=18:30`)
- Combine: `?location=JHR01&testDate=2026-02-20&testTime=12:00`

**External dependencies** (loaded via CDN):
- Google Fonts: Google Sans
- API: waktusolat.app (JAKIM data source)
- MST SIRIM widget (info.html only)

## Key Features

1. **Zone Selection**: 61 zones across Malaysia, grouped by state
2. **Zone Persistence**: Selected zone saved to localStorage and reflected in URL
3. **Shareable URLs**: URL auto-updates with `?location=` parameter for easy sharing
4. **Share Button**: Quick share/copy link button next to zone selector
5. **Compact Dropdown**: Shows zone code only when closed, full details when opened
6. **Dynamic Header**: Shows "Negeri {State} (Zon {Number})" and district name
7. **Countdown Timer**: Auto-switches between berbuka and next day's imsak with seamless phase transitions
8. **Time Box Highlight**: Green-filled highlight on the next upcoming prayer time box
9. **Warning Pulse**: Orange color pulse animation on countdown and time box 5 minutes before prayer time
10. **Midnight Auto-Refresh**: Data automatically refreshes at midnight for the next day
11. **Responsive Design**: Table view for desktop, card view for mobile (share button on row 2)
12. **GPS Auto-Detection**: Detects user location on first visit, pre-selects zone automatically
13. **GPS Button**: 📍 GPS pill button for manual re-detection at any time
14. **Contextual Messages**: Shows appropriate message before/after Ramadan period
15. **Info Page**: Documentation with shareable anchor sections