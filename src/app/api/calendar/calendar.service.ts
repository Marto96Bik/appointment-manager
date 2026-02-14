import { GoogleCalendarClient } from "@/integrations/google-calendar.client";
import { AppError } from "../core/errors/appCustomError";
import { findUserByUserId } from "../user/user.service";

export async function getCalendarEvents(userId: number, date: string) {
  const calendarClient = getCalendarClient(userId);

  const dateFrom = new Date(date);
  dateFrom.setHours(0, 0, 0, 0);

  const dateUntil = new Date(date);
  dateUntil.setDate(dateUntil.getDate() + 1);
  dateUntil.setHours(0, 0, 0, 0);

  return await calendarClient.listEvents(dateFrom, dateUntil);
}

function getCalendarClient(userId: number) {
  const user = findUserByUserId(userId);
  if (!user.refreshToken) {
    throw new AppError("Google not linked", 400);
  }
  return new GoogleCalendarClient(user.refreshToken);
}
