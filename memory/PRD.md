# Season Tracker - PRD

## Problem Statement
Build a season tracker based on user's local settings/hemisphere. Track every season and show percentage of time left. Simple, beautiful app with seasonal affirmations and browser push notifications for progress.

## Architecture
- **Frontend**: React 18 + Framer Motion (port 3000)
- **Backend**: FastAPI (port 8001)
- **Database**: MongoDB (notification preferences)
- **Fonts**: Playfair Display (headings) + Manrope (body)

## Core Requirements
- Auto-detect hemisphere via timezone
- Show current season with progress percentage (SVG circle)
- Days elapsed, remaining, total
- Hardcoded seasonal affirmations (7 per season)
- Hemisphere toggle (Northern/Southern)
- Browser push notification toggle
- Season-adaptive design (colors change per season)
- Mobile-first responsive layout

## What's Been Implemented (Feb 9, 2026)
- Full backend API: /api/season, /api/affirmation, /api/notifications/preferences
- Season detection logic with hemisphere support (N/S)
- SVG circular progress with animated fill (Framer Motion)
- 4 complete season color themes (spring, summer, autumn, winter)
- Glassmorphism affirmation card with refresh
- Hemisphere toggle with sliding indicator
- Notification toggle with browser Notification API
- Noise texture overlay for depth
- Fully responsive (tested at 390px mobile)
- All tests passing: 100% backend, frontend, integration, mobile

## User Personas
- General consumers wanting a calming way to track seasonal progress on phones

## Backlog
- P1: Service worker for offline support & scheduled notifications
- P1: Seasonal background images/illustrations
- P2: Share season progress as image card (social sharing)
- P2: Countdown timer to next season
- P3: Historical season data / almanac

## Next Tasks
- Add seasonal illustrations or subtle animated backgrounds
- Implement service worker for true push notification scheduling
