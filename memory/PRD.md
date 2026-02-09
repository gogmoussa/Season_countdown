# Season Tracker - PRD

## Problem Statement
Build a season tracker based on user's local settings/hemisphere. Track every season and show percentage of time left. Simple, beautiful app with seasonal affirmations and browser push notifications for progress. Enhanced to feel like a native mobile app.

## Architecture
- **Frontend**: React 18 + Framer Motion (port 3000)
- **Backend**: FastAPI (port 8001)
- **Database**: MongoDB (notification preferences)
- **Fonts**: Cormorant Garamond (headings) + DM Sans (body)
- **PWA**: manifest.json + service worker for installability

## Core Requirements
- Auto-detect hemisphere via timezone
- Show current season with animated progress ring (SVG + glow)
- Days elapsed, remaining, total in glass card
- Hardcoded seasonal affirmations (7 per season) with refresh
- Bottom tab navigation (Home / Seasons / Settings)
- All Seasons overview page with progress bars
- Settings: hemisphere toggle, notification toggle, install instructions
- Season timeline showing position in the yearly cycle
- Ambient seasonal particle animations
- Browser push notification support
- Season-adaptive design (4 complete color themes)
- Mobile-first, PWA-ready

## What's Been Implemented (Feb 9, 2026)

### MVP (Session 1)
- Full backend API: /api/season, /api/affirmation, /api/notifications/preferences
- Season detection logic with hemisphere support
- SVG circular progress with animation
- 4 season color themes
- Glassmorphism affirmation card
- Hemisphere toggle + Notification toggle
- Mobile responsive

### Enhancement (Session 2)
- PWA: manifest.json, service worker, viewport-fit=cover, apple-mobile-web-app meta tags
- Bottom tab navigation with animated indicator (Home/Seasons/Settings)
- Ambient particle animations (snowflakes, leaves, blossoms, fireflies)
- All Seasons overview page with progress bars + "Now" badge
- Settings page: hemisphere pills, notifications, install instructions, about
- Season timeline with pulsing current-season indicator
- Enhanced progress ring with glow effect + pulse animation
- Cormorant Garamond + DM Sans typography upgrade
- Gradient backgrounds per season
- Install prompt banner
- Safe area inset handling for notch phones
- /api/seasons/all endpoint for overview data
- All tests passing: 100% (23/23 tests)

## User Personas
- General consumers wanting a calming mobile app to track seasonal progress

## Backlog
- P1: Actual scheduled push notifications via service worker
- P2: Share season progress as social media image card
- P2: Dark mode option
- P3: Seasonal sound effects / ambient audio
- P3: Weather integration for local conditions
