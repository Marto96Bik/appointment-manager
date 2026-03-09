import { Appointment } from "@prisma/client";
import { AppError } from "@/lib/errors/appCustomError";

export async function fetchAppointments(start: string, end: string): Promise<Appointment[]> {
  const startDate = new Date(start).toISOString();
  const endDate = new Date(end).toISOString();
  const params = new URLSearchParams({ startDate, endDate });

  const res = await fetch(`/api/appointment?${params}`);
  if (!res.ok) {
    throw new AppError("Failed to fetch Appointments", res.status);
  }
  return res.json();
}

export async function fetchAppointment(eventId: string): Promise<Appointment> {
  const res = await fetch(`/api/appointment/${eventId}`);
  if (!res.ok) {
    throw new AppError("Failed to fetch the appointment", res.status);
  }
  return res.json();
}
