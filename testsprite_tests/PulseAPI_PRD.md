# PulseAPI — Product Requirements Document

## Overview
PulseAPI is a real-time API uptime monitoring platform. Users add HTTP endpoints, configure check intervals, and receive instant email alerts when an API goes down or recovers. A dashboard provides uptime history, response times, and shareable public status pages.

## Purpose
Give developers a simple, self-hosted way to monitor API health without complex third-party tools. Add a URL, pick an interval, and get notified — that's it.

## Core Features

### 1. Endpoint Management
- **Add Endpoint:** Users provide a URL, HTTP method (GET/POST/PUT/DELETE), expected status code, and check interval (1min / 5min / 1hr).
- **Edit/Delete Endpoint:** Users can update or remove monitored endpoints.
- **API Routes:** `POST /api/endpoints`, `GET /api/endpoints`, `PUT /api/endpoints/:id`, `DELETE /api/endpoints/:id`

### 2. Uptime Monitoring
- Background service pings each endpoint at its configured interval.
- Records response status code, response time (ms), and timestamp as a "Ping" record.
- Determines UP/DOWN status based on whether the response matches the expected status code.
- **API Route:** `GET /api/endpoints` returns endpoints with latest ping data.

### 3. Email Alerts
- When an endpoint transitions from UP to DOWN, sends a "down" email alert via Resend.
- When it transitions from DOWN back to UP, sends a "recovery" email alert.
- Users can toggle email alerts on/off in settings.
- **API Route:** `PUT /api/user/settings` to toggle alert preference.

### 4. Dashboard
- Displays all monitored endpoints with current status (UP/DOWN), response time, and uptime percentage.
- Auto-refreshes every 15 seconds.
- Shows a 30-day uptime bar chart per endpoint.

### 5. Activity Logs
- Full ping history per endpoint: status code, response time, timestamp.
- Limited to last 30 days, capped at 20 displayed entries.
- **API Route:** `GET /api/endpoints/:id/pings`

### 6. Shareable Status Pages
- Each endpoint can generate a public status page via a unique share token.
- Accessible without authentication.
- **API Routes:** `POST /api/endpoints/:id/share`, `GET /api/public/status/:shareToken`

### 7. Authentication
- Email/password signup with OTP email verification via Resend.
- Google OAuth login.
- Session-based auth using Better Auth with cookie sessions.
- **API Routes:** Handled by Better Auth at `/api/auth/*`

## Tech Stack
- **Backend:** Express.js, TypeScript, Prisma ORM, PostgreSQL, Better Auth, Resend, Zod
- **Frontend:** React, TypeScript, Vite, Framer Motion, React Router
- **Runtime:** Bun

## API Endpoints Summary

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| POST | /api/endpoints | Yes | Create new endpoint |
| GET | /api/endpoints | Yes | List user's endpoints |
| PUT | /api/endpoints/:id | Yes | Update endpoint |
| DELETE | /api/endpoints/:id | Yes | Delete endpoint |
| GET | /api/endpoints/:id/pings | Yes | Get ping history |
| POST | /api/endpoints/:id/share | Yes | Generate share token |
| GET | /api/public/status/:shareToken | No | Public status page data |
| PUT | /api/user/settings | Yes | Update user settings |
| GET | /api/user/settings | Yes | Get user settings |
| ALL | /api/auth/* | No | Auth routes (Better Auth) |
