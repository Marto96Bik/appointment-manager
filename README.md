# Appointment Manager

Responsive web app for simple patient appointment management.
Syncs with Google Calendar and sends automatic WhatsApp notifications.
Intiuitive design for users with limited technical knowledge.

## Status

**In development**

## Features

### Implemented / In Progress

- Google OAuth login
- Patient CRUD
- Appointment CRUD
- Interactive calendar (FullCalendar)
- PostgreSQL integration with Prisma ORM
- Google Calendar sync
- WhatsApp notifications (WA.Link)

### Notification Flows

- Confirmation
- Update
- Cancellation
- 24h Reminder

---

## Tech Stack

- **Backend & Frontend**: Next.js (App Router)
- **Auth**: Google OAuth + JWT
- **Database**: PostgreSQL (Docker)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Calendar UI**: FullCalendar
- **Notifications**: WA.Link redirects to WhatsApp
- **Calendar Sync**: Google Calendar API

---

## Project Structure

```
appointment-manager/
├── src/
│ ├── app/            # Frontend
│ │   └── api         # Backend
│ └── lib/            # Prisma client and utilities
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── docs/
│   └── specs-en.md   # Detailed project specifications
├── .env.example
└── README.md

```

---

## Local Development Setup

### 1. Requirements

- Node.js 18+
- Docker installed and running

### 2. Clone & Install

Clone the repository into your local:

```bash
git clone https://github.com/Marto96Bik/appointment-manager
cd appointment-manager
npm install
```

### 3. Environment Variables

Create a .env file based on the file **.env.example**

### 4. Start Database (Docker)

Starts a local PostgreSQL instance:

```bash
docker compose up -d
```

### 5. Run Prisma Migrations

For development:

```bash
npx prisma migrate dev
```

For production-like environments:

```bash
npx prisma migrate deploy
```

Generate Prisma client (if needed):

```bash
npx prisma generate
```

### 6. Start Application

```bash
npm run dev
```

App runs at:
http://localhost:3000

---

## Diagrams

### Process

![Process Flow](/docs/process.svg)

### ERD

![ERD](/docs/ERD.svg)

## Documentation

Detailed specs and scope: [docs/specs.md](./docs/specs.md)

## API Endpoints

### Patients

#### Create patient

**POST** `/api/patient`

```json
{
  "firstName": "Name",
  "lastName": "Lastname",
  "phone": "+972xxxxxxxxx",
  "documentId": "xxxxxxxxx"
}
```

#### Get list of patients

- **GET** /api/patient

#### Get patient by ID

- **GET** /api/patient/{id}

### Appointments

#### Create appointment

- **POST** /api/appointment
- **Body:**

```json
{
  "patientId": 1,
  "start": "2026-01-10T19:00:00.000Z",
  "end": "2026-01-10T20:00:00.000Z"
}
```

- **FLOW:**
- Validates input data
- Creates Google Calendar event
- Stores appointment with eventId
- Sends WhatsApp confirmation via WA.Link

#### Get all appointments

- **GET** /api/appointment

#### Get appointment by ID

- **GET** /api/appointment/{id}

### Patients

#### Create patient

- **POST** `/api/patient`
- **Body:**

```json
{
  "firstName": "Name",
  "lastName": "Lastname",
  "phone": "+972xxxxxxxxx",
  "documentId": "xxxxxxxxx"
}
```

#### Get list of patients

- **GET** /api/patient

#### Get patient by ID

- **GET** /api/patient/{id}

### Appointments

#### Create appointment

- **POST** /api/appointment
- **Body:**

```json
{
  "patientId": 1,
  "start": "2026-01-10T19:00:00.000Z",
  "end": "2026-01-10T20:00:00.000Z"
}
```

- **FLOW:**
- Validates input data
- Creates Google Calendar event
- Stores appointment with eventId
- Sends WhatsApp confirmation via WA.Link

#### Get all appointments

- **GET** /api/appointment

#### Get appointment by ID

- **GET** /api/appointment/{id}

## Future

Multi-tenant SaaS, reports, etc.
