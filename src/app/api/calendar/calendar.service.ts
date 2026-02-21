import { GoogleCalendarClient } from "@/integrations/google-calendar.client";
import { AppError } from "../core/errors/appCustomError";
import { findUserByUserId } from "../user/user.service";

export async function getCalendarEvents(userId: number, start: string, end: string) {
  const calendarClient = getCalendarClient(userId);

  const dateFrom = new Date(start);
  const dateUntil = new Date(end);

  return await calendarClient.listEvents(dateFrom, dateUntil);
}

function getCalendarClient(userId: number) {
  const user = findUserByUserId(userId);
  if (!user.refreshToken) {
    throw new AppError("Google not linked", 400);
  }
  return new GoogleCalendarClient(user.refreshToken);
}
