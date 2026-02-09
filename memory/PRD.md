# Season Tracker - PRD

## Problem Statement
Build a season tracker based on user's local settings/hemisphere. Track every season and show percentage of time left. Beautiful mobile-first PWA with seasonal affirmations and browser push notifications.

## Architecture
- **Frontend**: React 18 + Framer Motion (port 3000)
- **Backend**: FastAPI (port 8001)
- **Database**: MongoDB (notification preferences)
- **Fonts**: Cormorant Garamond (headings) + DM Sans (body)
- **PWA**: manifest.json, service worker, icons (192/512/apple-touch), favicon

## What's Been Implemented

### MVP (Session 1)
- Backend API: /api/season, /api/affirmation, /api/notifications/preferences
- Season detection with hemisphere support, SVG progress ring, 4 color themes

### Enhancement (Session 2)
- PWA, bottom tab nav, particle animations, All Seasons page, Settings page
- Season timeline, enhanced progress ring with glow, Cormorant Garamond + DM Sans

### Bug Fix (Session 3)
- Fixed Seasons page using hardcoded Northern dates instead of API data

### Bug Fix (Session 4)
- Active season now appears first in Seasons tab

### Deployment Polish (Session 5) - Feb 9, 2026
- Generated proper PNG app icons (192, 512, apple-touch-icon, favicon.ico)
- Enhanced service worker: network-first for API, cache-first for static, notification support
- Daily notification on app open (checks if enabled, once per day)
- Notification feedback in Settings
- NextSeasonCard: shows upcoming season with countdown
- ShareButton: Web Share API with clipboard fallback
- PWA manifest with real icon references
- apple-touch-icon + favicon for all browsers
- All 36 tests passing (100%)

## Backlog
- P1: True background push notifications (requires push server)
- P2: Dark mode toggle
- P2: Seasonal sound effects
- P3: Weather integration
