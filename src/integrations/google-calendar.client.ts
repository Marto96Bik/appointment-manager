import { google } from "googleapis";

export class GoogleCalendarClient {
  private calendar;

  constructor() {
    // refresh_token auth
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    this.calendar = google.calendar({ version: "v3", auth: oauth2Client });
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

  async createEvent(data: { title: string; date: string }) {}
}
