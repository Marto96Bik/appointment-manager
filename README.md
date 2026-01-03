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

## Diagrams

### Process

![Process Flow](/docs/process.svg)

### ERD

![ERD](/docs/ERD.svg)

## Tech Stack

- **Backend & Frontend**: Next.js + PostgreSQL + Tailwind + FullCalendar
- **Auth**: Google OAuth
- **Notifications**: Twilio WhatsApp API
- **Calendar**: Google Calendar API

## Project Structure

```
appointment-manager/
├── app/                  # Next.js v16.1.1
├── docs/
│   └── specs-en.md       # Detailed project specifications
└── README.md             # This file
```

## Documentation

Detailed specs and scope: [docs/specs.md](./docs/specs.md)

## Setup (coming soon)

Instructions to run locally will be added once basic structure is ready.

## Future

Multi-tenant SaaS, reports, etc.
