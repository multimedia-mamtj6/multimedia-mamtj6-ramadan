# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PWA testing directory for MULTIMEDIA MAMTJ6 project. Single-page HTML app with popup navigation to various multimedia projects.

## Development

No build step - static HTML served directly.

```bash
# Run locally
python -m http.server 8000
npx serve
```

## Structure

- `index.html` - Single-file app with embedded CSS/JS, popup menu system, notification feature, and SW registration
- `sw.js` - Service worker (cache-first strategy, version `mamtj6-pwa-test-v1.4.5`)
- `favicon/` - PWA icons and web manifest
- `favicon/site.webmanifest` - PWA manifest (standalone, scope `/pwa-test/`)
- `developer.md` - Detailed PWA technical documentation

## Key Features

- **Popup Menu System**: Buttons trigger popups via `data-popup` attribute linking to popup IDs
- **Content Notification**: Controlled by `hasNewUpdate` flag in DOMContentLoaded script - set to `true` to show update notification on page load
- **PWA with Service Worker**: Cache-first strategy caching local files and external assets for offline use
- **SW Update Toast**: Yellow toast notification ("Versi baharu tersedia!") when new SW version is detected, with immediate update via `skipWaiting()`

### Service Worker Updates
1. Update `CACHE_NAME` version in `sw.js` line 3 (e.g. `v1.4.5` → `v1.4.6`)
2. Deploy — users see update toast on next visit
3. See `developer.md` for full update flow documentation

## External Resources

- Logo: `i.postimg.cc` (header image, cached by SW)
- Background: `multimedia.mamtj6.com/media/img/plain-blue-bg.png` (cached by SW)
- Favicon SVG: GitHub raw content from `multimedia-mamtj6/dev` repo (not cached)
