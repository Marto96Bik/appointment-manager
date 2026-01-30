import { CreateAppointmentDto, GetAppointmentsDto } from "./appointent.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { GoogleCalendarClient } from "../../../integrations/google-calendar.client";
import { getPatientById } from "../patient/patient.service";
import { sendNotificationMessage } from "../../../lib/notification/notification.service";

const calendarClient = new GoogleCalendarClient();

export async function createAppointment(data: CreateAppointmentDto) {
  const patient = getPatientById(data.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  const message = `New appointment with ${patient?.name} ${patient?.lastName} `;
  /*const event = await calendarClient.createEvent({
    name: message,
    start: data.start,
    end: data.end,
  });

  if (!event.id) {
    throw new Error("Calendar event was created without ID");
  }*/
  const newAppointment = {
    id: inMemoryStore.appointments.length + 1,
    start: data.start,
    end: data.end,
    eventId: "event.id",
    patientId: data.patientId,
  };
  inMemoryStore.appointments.push(newAppointment);
  //await sendNotificationMessage(patient, newAppointment);
  return newAppointment;
}

export async function getAppointments(params: GetAppointmentsDto) {
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

export function getAppointmentById(id: number) {
  return inMemoryStore.appointments.find((appointent) => appointent.id === id);
}
