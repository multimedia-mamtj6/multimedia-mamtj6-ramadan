# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A vanilla JavaScript countdown web application for Ramadan 2026 (1447H) with dual display modes:
- **Hijri countdown** (default): Precise countdown to Maghrib time (7:29 PM) on February 18, 2026 in Kuala Lumpur
- **Masihi (Gregorian) countdown**: Days remaining until February 19, 2026

The application features PNG image export, service worker-based PWA capabilities, and time synchronization with Malaysia timezone via worldtimeapi.org.

## Development Commands

### Running the Application
The app requires a web server due to external resource loading and API calls:
- **VS Code**: Use Live Server extension - open `index.html` and click "Go Live" in status bar
- **Python**: `python -m http.server 8000` then navigate to `http://localhost:8000`
- **Node.js**: Use `npx serve` or `npx http-server`

### Testing Updates
When testing service worker updates:
1. Update the `CACHE_NAME` version in `sw.js:3` (e.g., `v1.4.4` → `v1.4.5`)
2. Update the version display in `index.html:144` to match
3. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or clear cache in DevTools

## Architecture

### Time Synchronization
- On page load, `synchronizeWithMalaysiaTime()` calls worldtimeapi.org API once
- Calculates `timeOffset` between server time and local device time
- All countdown calculations use `Date.now() + timeOffset` to ensure consistency across users

### Dual Countdown System
Two independent countdown modes managed by tab switching:
- **Hijri mode** (`hijriTargetDate`): Real-time countdown with hours/minutes/seconds using interval updates and circular progress rings
- **Masihi mode** (`masihiTargetDate`): Simple day count without interval updates

The active mode is controlled via CSS classes (`.active-panel`) with cross-fade transitions managed purely by CSS opacity/visibility properties.

### Canvas-Based Image Export
The export system (`generateImage()` in `script.js:194-228`) uses HTML5 Canvas:
1. User clicks floating export button → popup shows Hijri/Masihi choice
2. Loads template PNG (1080x1080) from `/media/template/`
3. Uses `drawCenteredTextWithSpacing()` with `textBaseline: 'middle'` for consistent cross-browser text rendering
4. Generates preview using `canvas.toDataURL('image/png')`
5. User confirms → triggers download

**Important**: The `ctx.textBaseline = 'middle'` setting (script.js:184) ensures consistent text positioning between Chrome/Blink and Safari/WebKit engines.

### Service Worker (sw.js)
Implements cache-first strategy with update notifications:
- Caches all static assets listed in `urlsToCache` (sw.js:6-26)
- On activation, deletes old caches with different `CACHE_NAME`
- Listens for `SKIP_WAITING` message to activate updates immediately
- Update toast (index.html:148-156) notifies users when new version is available

### File Structure
```
/
├── index.html          # Main countdown page
├── info.html           # Information page
├── script.js           # All countdown logic and export functionality
├── style.css           # Complete styling (uses CSS custom properties)
├── sw.js              # Service worker for PWA features
└── media/
    ├── background/    # SVG pattern overlay
    ├── favicon/       # Complete favicon set + manifest
    ├── icon/          # Download button icon
    ├── image/         # Header calligraphy SVG
    ├── preview/       # Social media preview image (1200x630)
    └── template/      # Export PNG templates (1080x1080)
```

## Key Implementation Details

### Tab Switching Logic (script.js:132-155)
Simplified to use only CSS class toggling:
- Updates `data-active-tab` attribute on tab container
- Toggles `.active-panel` class on content panels
- CSS handles all transition animations via opacity/visibility
- Hijri interval is cleared when switching to Masihi mode, restarted when returning

### Cross-Fade Transitions
Panel transitions use `opacity` + `visibility` with delayed visibility toggle:
- Inactive panels: `opacity: 0; visibility: hidden; transition: opacity 0.4s, visibility 0s 0.4s`
- Active panels: `opacity: 1; visibility: visible; transition: opacity 0.4s, visibility 0s 0s`
- This creates true cross-fade effect without position jumping

### Responsive Design
Mobile adjustments in `@media (max-width: 600px)`:
- `body` gets `padding-bottom: 100px` to prevent floating button from covering footer
- Update toast positioned at `bottom: 100px` to avoid overlapping download button
- Font sizes use `clamp()` for fluid typography

### External Dependencies
1. **World Time API**: `https://worldtimeapi.org/api/timezone/Asia/Kuala_Lumpur` - called once on load
2. **Google Fonts**: Merriweather (weights 400, 700) with preconnect optimization

## Important Notes

- The application is in **Malay language** (lang="ms")
- Target dates are hardcoded in `script.js:3-4` - update these for different years
- SEO meta tags and Open Graph data in `index.html:9-42` reference domain `ramadan.mamtj6.com` - update for deployment
- Background uses layered approach: `radial-gradient` on body + SVG pattern via `::before` pseudo-element at configurable opacity (style.css:43)
- All circular progress animations use stroke-dashoffset with CIRCUMFERENCE constant of 220 (script.js:8)
