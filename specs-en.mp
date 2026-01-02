# Project Requirements Document: Appointment Management System

**Version:** 1.0  
**Date:** January 02, 2026  
**Author:** Martin Bikiel  
**Project Name:** Appointment Manager

## Quick Overview

Responsive web app for simple patient appointment management with Google Calendar sync, automatic WhatsApp notifications to patients and intiuitive design for users with limited technical knowledge.

**MVP Goal:**

- Patients CRUD with basic patient information.
- Scheduling/edit/delete appointments via google calendar
- WhatsApp notification to patients.

**Tech Stack:** NestJS + Prisma + Postgres, Twilio API for WhatsApp, Google Calendar API and Next.js (frontend).

## MVP Scope

**Included:**

- Google signup and login
- Basic profile edit
- Full patient & appointment CRUD
- Responsive calendar view (month/week/day)
- Automatic patient WhatsApp notification on create/edit/delete/24h reminder
- Side menu: Profile / Calendar / Patients / Logout / Delete account

**Not included (MVP):**

- Manual signup (without google account)
- Patient self-booking portal
- Payments
- Multi-user / roles
- Multiple Google calendars

## Features

### Authentication & Account

- Login with Google OAuth
- Edit profile: name, lastname, email, phone (used in WhatsApp messages)
- Logout
- Delete account (removes all data)

### Patient Management

- Create patient: name, lastname, phone (required), email (optional)
- List / search / edit / delete patients

### Appointment Management

- Responsive calendar showing appointments + synced Google Calendar events
- Create: click slot → pick patient → set time/notes → on confirm → patient WhatsApp notification.
- Edit: click event → update details → on confirm → patient WhatsApp update notification.
- Delete: click event → cancel → on confirm → patient WhatsApp cancel notification.

### Notifications

- WhatsApp via Twilio: Appointment set, update or cancel.
- Automatic 24h reminder before appointment (cron job).

## Non-Functional

- Fully responsive (mobile first)
- Fast load (<2s main pages)
- Secure (Google auth)
- Intuitive UI for non-tech users
- Google Calendar sync

## Future (Post-MVP)

Reports & stats (patient appointment report)

---

Quick dev reference & backlog guide. Will evolve with feedback.
