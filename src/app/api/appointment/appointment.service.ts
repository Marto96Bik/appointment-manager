import { CreateAppointmentDTO, GetAppointmentDTO, PatchAppointmentDTO } from "./appointment.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { GoogleCalendarClient } from "../../../integrations/google-calendar.client";
import { getPatientById } from "../patient/patient.service";
import { sendNotification } from "../../../lib/notification/notification.service";
import { AppError } from "../core/errors/appCustomError";
import { Appointment } from "./appointment.model";
import { findUserByUserId } from "../user/user.service";

export async function createAppointment(userId: number, data: CreateAppointmentDTO) {
  const patient = getPatientById(userId, data.patientId);
  const calendarClient = getCalendarClient(userId);
  const message = `New appointment with ${patient?.name} ${patient?.lastname} `;

  // New event in google calendar
  const event = await calendarClient.createEvent({
    name: message,
    start: data.start,
    end: data.end,
  });

  if (!event.id) {
    throw new AppError("Calendar event was created without ID", 503);
  }

  // Add appointment to db
  const newAppointment = {
    id: inMemoryStore.appointments.length + 1,
    start: data.start,
    end: data.end,
    eventId: "event1",
    patientId: data.patientId,
    userId,
  };
  inMemoryStore.appointments.push(newAppointment);

  // Send custom notification
  sendNotification(patient, newAppointment, "create");
  return newAppointment;
}

export async function getAppointments(userId: number, params: GetAppointmentDTO) {
  const { startDate, patientId } = params;

  return inMemoryStore.appointments.filter((a) => {
    if (a.userId !== userId) return false;
    if (startDate && a.start.slice(0, 10) !== startDate) return false;
    if (patientId && a.patientId !== patientId) return false;

    return true;
  });
}

export async function getCalendarEvents(userId: number, dateStart: Date, maxResults: number) {
  const calendarClient = getCalendarClient(userId);
  return await calendarClient.listEvents(dateStart, maxResults);
}

export async function getAppointmentByEventId(userId: number, id: string) {
  const appointment = inMemoryStore.appointments.find(
    (appointment) => userId === appointment.userId && appointment.eventId === id,
  );
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }
  return appointment;
}

export async function updateAppointment(
  userId: number,
  eventId: string,
  data: PatchAppointmentDTO,
) {
  // Appointment search
  const index = getIndexByEventId(userId, eventId);
  const appointment = inMemoryStore.appointments[index];

  // New appointment data
  const updatedAppointment: Appointment = {
    ...appointment,
    start: data.start ?? appointment.start,
    end: data.end ?? appointment.end,
  };

  // DB update
  const patient = getPatientById(userId, updatedAppointment.patientId);
  inMemoryStore.appointments[index] = updatedAppointment;

  // Google Calendar update
  const calendarClient = getCalendarClient(userId);
  await calendarClient.editEvent(eventId, {
    start: data.start,
    end: data.end,
  });

  // Send custom notification
  sendNotification(patient, updatedAppointment, "update");
  return updatedAppointment;
}

export async function deleteAppointment(userId: number, eventId: string) {
  // Search appointment
  const index = getIndexByEventId(userId, eventId);
  const deletedAppointment = inMemoryStore.appointments[index];

  // DB delete
  const patient = getPatientById(userId, deletedAppointment.patientId);
  inMemoryStore.appointments.splice(index, 1);

  // Google Calendar Delete
  const calendarClient = getCalendarClient(userId);
  await calendarClient.deleteEvent(eventId);

  // Send custom notification
  await sendNotification(patient, deletedAppointment, "delete");
  return inMemoryStore.appointments;
}

function getCalendarClient(userId: number) {
  const user = findUserByUserId(userId);
  if (!user.refreshToken) {
    throw new AppError("Google not linked", 400);
  }
  return new GoogleCalendarClient(user.refreshToken);
}

function getIndexByEventId(userId: number, eventId: string) {
  const index = inMemoryStore.appointments.findIndex(
    (a) => a.userId === userId && a.eventId === eventId,
  );
  if (index === -1) {
    throw new AppError("Appointment not found", 404);
  }
  return index;
}
