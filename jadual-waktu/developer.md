# Developer Guide

Technical documentation for the Jadual Waktu Ramadan 2026 application.

## File Structure

```
info/
├── index.html     # Main application (single-file)
├── CLAUDE.md      # Claude Code instructions
├── README.md      # User documentation (Malay)
└── developer.md   # This file
```

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
// Get saved zone or default
getSavedZone() // Returns: "PHG03" (default)

// Save zone to localStorage
saveZone(zoneCode)

// Load and populate zone dropdown
async loadZones()

// Update header with zone info
updateZoneHeader(zone)
```

### Data Fetching

```javascript
// Fetch prayer data for Ramadan period
async fetchData()
// - Fetches Feb & Mar 2026 in parallel
// - Filters to Ramadan dates (Feb 19 - Mar 20)
// - Populates desktop table and mobile cards
// - Sets up countdown timer
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

### Test Date Parameter

Add `?testDate=YYYY-MM-DD` to URL:

```
index.html?testDate=2026-02-19  # First day of Ramadan
index.html?testDate=2026-02-20  # Second day
index.html?testDate=2026-03-20  # Last day of Ramadan
```

### Test Scenarios

1. **Zone Selection**: Change zones, verify header updates
2. **Zone Persistence**: Refresh page, verify zone is remembered
3. **Countdown**: Test during fasting hours vs after berbuka
4. **Responsive**: Test on mobile and desktop widths

## CSS Classes

### Layout
- `.zone-selector` - Dropdown container
- `.today-container` - Today's info and countdown section
- `.infaq-section` - Donation promotion section

### Tables
- `#desktop-schedule-table` - Desktop table view
- `#mobile-schedule-table` - Mobile card view
- `.today-row` - Highlighted current day row

### Countdown
- `#countdown-section` - Countdown container
- `.countdown-item` - Hours/minutes/seconds boxes
- `#countdown-progress-bar` - Progress bar fill

## Ramadan 2026 Dates

- **Start**: 19 February 2026 (1 Ramadan 1447H)
- **End**: 20 March 2026 (30 Ramadan 1447H)
- **Eid**: 21 March 2026 (1 Syawal 1447H)
