# Developer Guide

**Version:** 1.3.3

Technical documentation for the Jadual Waktu Ramadan 2026 application.

## File Structure

```
jadual-waktu/
├── index.html     # Main application (single-file)
├── info.html      # Information/documentation page
├── CLAUDE.md      # Claude Code instructions
├── README.md      # User documentation (Malay)
└── developer.md   # This file
```

## Pages

### index.html (Main Application)
- Prayer times display with countdown
- Zone selector with 61 zones
- Desktop table and mobile card views
- Share functionality

### info.html (Information Page)
- Project information and CSR details
- Data source documentation
- Time accuracy reminder with MST SIRIM widget
- Infaq & Wakaf section
- Anchor links for sharing specific sections

## API Endpoints

### Zones List
```
GET https://api.waktusolat.app/zones
```

Response structure:
```json
[
  {
    "jakimCode": "PHG03",
    "negeri": "Pahang",
    "daerah": "Jerantut, Temerloh, Maran..."
  }
]
```

### Prayer Times
```
GET https://api.waktusolat.app/v2/solat/{zone}?year={year}&month={month}
```

Example: `https://api.waktusolat.app/v2/solat/PHG03?year=2026&month=2`

Response structure:
```json
{
  "prayers": [
    {
      "day": 19,
      "hijri": "1447-09-01",
      "fajr": 1740009600,
      "maghrib": 1740052800
    }
  ]
}
```

## Key Functions

### Zone Management

```javascript
// Get saved zone from URL, localStorage, or default
getSavedZone() // Returns: "PHG03" (default)

// Save zone to localStorage and update URL
saveZone(zoneCode)

// Load and populate zone dropdown
async loadZones()

// Update header with zone info
updateZoneHeader(zone)
```

### Share Functionality

```javascript
// Share/copy current page URL with zone info
shareLink()
// - Gets selected zone from dropdown
// - Looks up zone details (negeri, jakimCode, daerah) from cachedZones
// - Builds share text: "Negeri {State} (Zon {Number}): {District}"
// - Uses navigator.share on mobile (native share sheet with text)
// - Falls back to clipboard copy on desktop
// - Shows "Disalin!" feedback for 2 seconds
```

### Data Fetching

```javascript
// Fetch prayer data for Ramadan period
async fetchData()
// - Fetches Feb & Mar 2026 in parallel
// - Filters to Ramadan dates (Feb 19 - Mar 20)
// - Populates desktop table and mobile cards
// - Sets up countdown timer
// - Shows contextual messages before/after Ramadan
```

### Countdown Timer

```javascript
// Determine countdown target
setupCountdown()
// - Before Maghrib: countdown to berbuka
// - After Maghrib: countdown to tomorrow's Imsak

// Start countdown with progress bar
startCountdown(targetTime, startTime, label, totalDuration)
```

### Date Helpers

```javascript
// Get test date from URL or current date
getTestDate()

// Check if date matches today
isToday(day, month)

// Check if date matches tomorrow
isTomorrow(day, month)

// Format Hijri date for display
formatHijriForRamadan(hijri) // "1 Ramadan", "2 Ramadan", etc.
```

## localStorage Keys

| Key | Value | Description |
|-----|-------|-------------|
| `selectedZone` | Zone code (e.g., "PHG03") | User's selected zone |

## Global Variables

```javascript
globalPrayerTimes = {
  today: { fajr, maghrib },    // Unix timestamps
  tomorrow: { fajr, maghrib }
}

countdownTimerId = null  // setInterval ID for cleanup

cachedZones = []  // Zone list from API
```

## Testing

### URL Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `location` | `?location=JHR01` | Auto-load specific zone |
| `testDate` | `?testDate=2026-02-20` | Simulate specific date |

**Examples:**
```
index.html?location=JHR01                      # Load Johor Zone 1
index.html?testDate=2026-02-20                 # Test Feb 20, 2026
index.html?location=SGR01&testDate=2026-03-15  # Combine both
```

### Test Scenarios

1. **Zone Selection**: Change zones, verify header and URL updates
2. **Zone Persistence**: Refresh page, verify zone is remembered
3. **Share Button**: Click share, verify URL is copied/shared
4. **Countdown**: Test during fasting hours vs after berbuka
5. **Before Ramadan**: Test with date before Feb 19, verify message
6. **After Ramadan**: Test with date after Mar 20, verify message
7. **Responsive**: Test on mobile and desktop widths
8. **Info Page Anchors**: Test `info.html#waktu`, `info.html#sumber`, etc.

## CSS Classes

### Layout
- `.zone-selector` - Dropdown and share button container
- `.share-btn` - Share button (pill-shaped)
- `.today-container` - Today's info and countdown section
- `.infaq-section` - Donation promotion section
- `.schedule-title` - Table section heading

### Tables
- `#desktop-schedule-table` - Desktop table view
- `#mobile-schedule-table` - Mobile card view
- `.today-row` - Highlighted current day row

### Countdown
- `#countdown-section` - Countdown container
- `.countdown-item` - Hours/minutes/seconds boxes
- `#countdown-progress-bar` - Progress bar fill
- `.time-reminder-link` - Link to time accuracy info

### Info Page
- `.info-section` - Content section with anchor
- `.anchor-link` - Shareable section link (#)
- `.highlight-box` - Highlighted info box
- `.toc` - Table of contents
- `.infaq-btn` - Infaq button

## Ramadan 2026 Dates

- **Start**: 19 February 2026 (1 Ramadan 1447H)
- **End**: 20 March 2026 (30 Ramadan 1447H)
- **Eid**: 21 March 2026 (1 Syawal 1447H)

## Changelog

### v1.3.3 (2026-02-18)
- Added PWA installation guide section to info.html (Android, iOS, Desktop)
- Added offline usage note and update notification explanation
- Added PWA feature bullets to Ciri-ciri utama list
- Bumped SW cache name to `v1.5.2`

### v1.3.2 (2026-02-18)
- Updated share text format: removed "Bagi" prefix, added blank line before URL
- Bumped SW cache name to `v1.5.0`

### v1.3.1 (2026-02-18)
- Fixed share link bug: URL now always includes `?location=` even on first page load
- Updated share text format to 3 lines: title, zone info, and URL
- Bumped SW cache name to `v1.4.9`

### v1.3.0 (2026-02-18)
- Registered service worker for full PWA support (cache-first, offline support)
- Added update notification toast (green) when a new SW version is available
- Fixed HTML `lang` attribute to `ms`
- Aligned `theme_color` between HTML meta and web manifest to `#ffffff`
- Fixed extra double-quote in OG meta title tag
- Added `any` purpose icon entries in web manifest for 192×192 and 512×512 PNGs
- Bumped SW cache name to `v1.4.8`

### v1.2.2 (2026-02-03)
- Updated share text format: "Negeri {State} (Zon {Number}): {District}"

### v1.2.1 (2026-02-03)
- Share button now includes zone info (state, code, district) in share text

### v1.2.0 (2026-02-03)
- New info page (`info.html`) with shareable anchor sections
- URL auto-updates with `?location=` parameter for easy sharing
- Share button next to zone dropdown (native share on mobile, clipboard on desktop)
- Contextual messages for before/after Ramadan period
- Pill-shaped dropdown matching share button style
- "Jadual Keseluruhan Bulan Ramadan" title above schedule
- Navigation links between main page and info page
- MST SIRIM widget for time verification
- Infaq & Wakaf section on both pages
- Black text color for dropdown options

### v1.1.0 (2026-02-02)
- Green and white theme for countdown timer
- Green accents for INFO HARI INI time boxes
- Green highlight with white text for mobile today card
- Updated date format in INFO HARI INI section

### v1.0.0 (2026-02-02)
- Initial release for Ramadan 1447H / 2026M
- Zone selector with 61 zones across Malaysia (grouped by state)
- Zone persistence via localStorage
- Compact dropdown display (zone code only when closed, full details in options)
- Dynamic header showing state name, zone number, and district
- URL parameters support: `location` and `testDate`
- Combined date format: "1 Ramadan / 19 Feb (Khamis)"
- Countdown timer to berbuka/imsak with progress bar
- Responsive design (desktop table & mobile cards)
- Data from JAKIM via Waktu Solat API