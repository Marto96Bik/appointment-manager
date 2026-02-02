import { AppError } from "@/app/api/core/errors/appCustomError";
import { calendar_v3, google } from "googleapis";

export class GoogleCalendarClient {
  private calendar;

  constructor() {
    // refresh_token auth
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    this.calendar = new calendar_v3.Calendar({ auth: oauth2Client });
  }

  async listEvents(fromDate: Date, maxResults?: number) {
    const res = await this.calendar.events.list({
      calendarId: "primary", // Calendar identifier.
      timeMin: fromDate.toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    return res.data.items ?? [];
  }

  async createEvent(data: { name: string; start: string; end: string }) {
    const res = await this.calendar.events.insert({
      // Calendar identifier. To retrieve calendar IDs call the calendarList.list method. If you want to access the primary calendar of the currently logged in user, use the "primary" keyword.
      calendarId: "primary",
      sendUpdates: "all", // Notificate the creation of the new event. Default false.
      requestBody: {
        summary: data.name,
        start: {
          dateTime: data.start,
          timeZone: "Asia/Jerusalem",
        },
        end: {
          dateTime: data.end,
          timeZone: "Asia/Jerusalem",
        },
      },
    });

    if (res.status !== 200 || res.data.status === "cancelled") {
      throw new AppError("Google Calendar did not update event", 409);
    }

    return await res.data;
  }

  async editEvent(eventId: string, data: { name?: string; start?: string; end?: string }) {
    const res = await this.calendar.events.patch({
      calendarId: "primary",
      eventId,
      sendUpdates: "all",
      requestBody: {
        ...(data.name && { summary: data.name }),
        ...(data.start && {
          start: {
            dateTime: data.start,
            timeZone: "Asia/Jerusalem",
          },
        }),
        ...(data.end && {
          end: {
            dateTime: data.end,
            timeZone: "Asia/Jerusalem",
          },
        }),
      },
    });

    if (res.status !== 200 || res.data.status === "cancelled") {
      throw new AppError("Google Calendar did not update event", 409);
    }

    return res.data;
  }
}
