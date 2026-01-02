# Appointment Manager

Responsive web app for simple patient appointment management.
Syncs with Google Calendar and sends automatic WhatsApp notifications.
Intiuitive design for users with limited technical knowledge.

## Status

**In development**

## Features (planned/implemented)

- Google OAuth login
- Patient CRUD
- Appointment CRUD via interactive calendar
- Google Calendar sync
- WhatsApp notifications: confirmation, updates, cancellation, 24h reminder

## Tech Stack

- **Frontend**: Next.js + Tailwind + FullCalendar
- **Backend**: NestJS + Prisma + PostgreSQL/Docker
- **Auth**: Google OAuth
- **Notifications**: Twilio WhatsApp API
- **Calendar**: Google Calendar API

## Project Structure

agenda-pro/
├── backend/ # NestJS API
├── frontend/ # Next.js app
└── docs/
└── specs.md # Project specifications (link below)

## Documentation

Detailed specs and scope: [docs/specs.md](./docs/specs.md)

## Setup (coming soon)

Instructions to run locally will be added once basic structure is ready.

## Future

Multi-tenant SaaS, reports, etc.
