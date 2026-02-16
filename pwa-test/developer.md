# PWA Developer Documentation

Technical documentation for the PWA implementation in `pwa-test/`.

## File Structure

```
pwa-test/
├── index.html                  # Single-file app (embedded CSS/JS)
├── sw.js                       # Service worker (cache-first strategy)
├── favicon/
│   ├── site.webmanifest        # PWA manifest
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── web-app-manifest-192x192.png
│   └── web-app-manifest-512x512.png
└── developer.md                # This file
```

## Service Worker (`sw.js`)

### Caching Strategy: Cache-First

The service worker uses a **cache-first** strategy:

1. Browser requests a resource
2. SW checks cache first (`caches.match()`)
3. If found in cache → return cached response
4. If not in cache → fetch from network

### Cache Name & Versioning

```javascript
const CACHE_NAME = 'mamtj6-pwa-test-v1.4.5';
```

- **Prefix**: `mamtj6-pwa-test-` (distinguishes from other apps on the same origin, e.g. `ramadan-countdown-`)
- **Version**: Increment on every deployment (e.g. `v1.4.5` → `v1.4.6`)
- The activate handler only deletes caches matching the `mamtj6-pwa-test-` prefix, so other apps' caches are safe

### Cached Resources

| Type | Files |
|------|-------|
| Pages | `./`, `index.html` |
| Favicons | `favicon/favicon.ico`, `favicon.svg`, `apple-touch-icon.png`, `favicon-96x96.png` |
| Manifest icons | `favicon/web-app-manifest-192x192.png`, `favicon/web-app-manifest-512x512.png` |
| Manifest | `favicon/site.webmanifest` |
| External | Logo from `i.postimg.cc`, Background from `multimedia.mamtj6.com` |

> **Note**: External assets are cached as opaque responses (status 0). If either external URL is unreachable during first install, `cache.addAll()` will fail and the SW won't install.

### SW Lifecycle Events

| Event | Action |
|-------|--------|
| `install` | Opens cache, stores all `urlsToCache` |
| `activate` | Deletes old `mamtj6-pwa-test-*` caches |
| `fetch` | Cache-first lookup, network fallback |
| `message` | Listens for `SKIP_WAITING` to activate immediately |

---

## Update Flow (Immediate Update Strategy)

The app uses a **notification-based immediate update** pattern:

```
User visits page
    ↓
Browser checks for new sw.js (byte comparison)
    ↓
New SW found → 'updatefound' event fires
    ↓
New SW installs → enters 'installed' state (waiting)
    ↓
Toast shown: "Versi baharu tersedia!"
    ↓
User clicks "Kemaskini" → sends SKIP_WAITING message
    ↓
New SW calls self.skipWaiting() → becomes active
    ↓
'controllerchange' event fires → page auto-reloads
```

### Key Code Locations

| Component | File | Location |
|-----------|------|----------|
| SW registration | `index.html` | Second `<script>` block (after DOMContentLoaded script) |
| Update toast HTML | `index.html` | `<div id="update-toast">` before `<footer>` |
| Update toast CSS | `index.html` | `.update-toast` section in `<style>` block |
| SKIP_WAITING handler | `sw.js` | `message` event listener |

### Toast UI Elements

| Element | ID/Class | Action |
|---------|----------|--------|
| Toast container | `#update-toast` | `.hidden` class toggles visibility |
| Update button | `#reload-btn` | Sends `SKIP_WAITING` to waiting SW |
| Dismiss button | `#dismiss-btn` | Adds `.hidden` class to toast |

---

## Web App Manifest (`favicon/site.webmanifest`)

| Field | Value | Notes |
|-------|-------|-------|
| `name` | MULTIMEDIA MAMTJ6 | Full app name |
| `short_name` | MAMTJ6 | Shown on home screen |
| `description` | Info tentang projek multimedia... | App description |
| `start_url` | `/pwa-test/` | Entry point with trailing slash (Vercel config) |
| `scope` | `/pwa-test/` | Must be explicit (default would be `/pwa-test/favicon/`) |
| `display` | standalone | Full-screen without browser UI |
| `orientation` | portrait | Portrait lock |
| `theme_color` | #333333 | Matches body background |
| `background_color` | #333333 | Splash screen background |
| `categories` | education, utilities | App store categories |
| `icons` | 192x192, 512x512 | Both maskable purpose |

> **Important**: `scope` is set explicitly to `/pwa-test/` because the manifest lives in `/pwa-test/favicon/`. Without it, the default scope would be the manifest's directory, breaking navigation.

---

## Deploying Updates

### Steps

1. Make changes to `index.html` or any cached file
2. Update `CACHE_NAME` version in `sw.js` line 3:
   ```javascript
   const CACHE_NAME = 'mamtj6-pwa-test-v1.4.6'; // was v1.4.5
   ```
3. Deploy to Vercel
4. On next visit, users see the yellow update toast and can click "Kemaskini" to apply

### Testing Locally

```bash
# Serve with any local server
python -m http.server 8000
npx serve

# Then verify in browser:
# 1. DevTools > Application > Manifest — all fields present
# 2. DevTools > Application > Service Workers — registered at /pwa-test/
# 3. DevTools > Application > Cache Storage — mamtj6-pwa-test-v1.4.5 exists
# 4. DevTools > Network > Offline checkbox → reload still works
```

### Testing the Update Flow

1. Change `CACHE_NAME` to a new version (e.g. `v1.4.6`)
2. Reload the page
3. Yellow toast should appear at bottom: "Versi baharu tersedia!"
4. Click "Kemaskini" — page reloads with new SW active
5. Verify in DevTools > Application > Service Workers: new version is active

---

## Notification Systems (Two Separate Systems)

This app has **two independent notification systems**:

### 1. Content Notification (Manual)
- **Purpose**: Inform users about new pages/features added
- **Control**: `hasNewUpdate` flag in DOMContentLoaded script (set to `true`/`false`)
- **UI**: Blue centered popup (`#notification` div)
- **Behavior**: Shows after 2s, auto-hides after 10s

### 2. SW Update Toast (Automatic)
- **Purpose**: Inform users about new app version via service worker
- **Control**: Automatic — triggers when browser detects new `sw.js`
- **UI**: Yellow bottom toast (`#update-toast` div)
- **Behavior**: Shows when new SW is installed, user clicks to apply

These are completely independent — content notification is for editorial updates, SW toast is for code deployments.
