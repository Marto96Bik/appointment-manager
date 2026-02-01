import { CreateAppointmentDto, GetAppointmentDto, PutAppointmentDto } from "./appointment.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { GoogleCalendarClient } from "../../../integrations/google-calendar.client";
import { getPatientById } from "../patient/patient.service";
import { sendNotification } from "../../../lib/notification/notification.service";
import { AppError } from "../core/errors/appCustomError";
import { Appointment } from "./appointment.model";

const calendarClient = new GoogleCalendarClient();

export async function createAppointment(data: CreateAppointmentDto) {
  const patient = getPatientById(data.patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  const message = `New appointment with ${patient?.name} ${patient?.lastname} `;
  const event = await calendarClient.createEvent({
    name: message,
    start: data.start,
    end: data.end,
  });

  if (!event.id) {
    throw new AppError("Calendar event was created without ID", 503);
  }

  const newAppointment = {
    id: inMemoryStore.appointments.length + 1,
    start: data.start,
    end: data.end,
    eventId: "event1",
    patientId: data.patientId,
  };
  inMemoryStore.appointments.push(newAppointment);
  await sendNotification(patient, newAppointment, "create");
  return newAppointment;
}

export async function getAppointments(params: GetAppointmentDto) {
  const { startDate, patientId } = params;

  return inMemoryStore.appointments.filter((appointment) => {
    if (startDate && appointment.start.slice(0, 10) !== startDate) {
      return false;
    }
    if (patientId && appointment.patientId !== patientId) {
      return false;
    }
    return true;
  });
}

export async function getCalendarEvents(dateStart: Date, maxResults: number) {
  return await calendarClient.listEvents(dateStart, maxResults);
}

export async function getAppointmentByEventId(id: string) {
  const appointment = inMemoryStore.appointments.find((appointment) => appointment.eventId === id);
  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }
  return appointment;
}

export async function editAppointment(eventId: string, data: PutAppointmentDto) {
  await calendarClient.editEvent(eventId, {
    start: data.start,
    end: data.end,
  });

  const index = inMemoryStore.appointments.findIndex((a) => a.eventId === eventId);

  if (index === -1) {
    throw new AppError("Appointment not found", 404);
  }
  const appointment = inMemoryStore.appointments[index];

  const updatedAppointment: Appointment = {
    ...appointment,
    start: data.start ?? appointment.start,
    end: data.end ?? appointment.end,
  };

  const patient = getPatientById(updatedAppointment.patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  inMemoryStore.appointments[index] = updatedAppointment;
  await sendNotification(patient, updatedAppointment, "update");
  return updatedAppointment;
}

export async function deleteAppointment(eventId: string) {
  await calendarClient.deleteEvent(eventId);

  const index = inMemoryStore.appointments.findIndex((a) => a.eventId === eventId);

  if (index === -1) {
    throw new AppError("Appointment not found", 404);
  }

  const deletedAppointment = inMemoryStore.appointments[index];

  const patient = getPatientById(deletedAppointment.patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }

  inMemoryStore.appointments.splice(index, 1);
  await sendNotification(patient, deletedAppointment, "delete");
  return inMemoryStore.appointments;
}
