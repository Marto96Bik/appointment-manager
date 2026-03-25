import { GoogleCalendarClient } from "@/integrations/google-calendar.client";
import { AppError } from "../../../lib/errors/appCustomError";
import { findUserByUserId } from "../user/user.service";

export async function getCalendarEvents(userId: number, start: string, end: string) {
  const calendarClient = await getCalendarClient(userId);

  const dateFrom = new Date(start);
  const dateUntil = new Date(end);

  return await calendarClient.listEvents(dateFrom, dateUntil);
}

async function getCalendarClient(userId: number) {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.refreshToken) {
    throw new AppError("Google not linked", 400);
  }
  return new GoogleCalendarClient(user.refreshToken);
}
