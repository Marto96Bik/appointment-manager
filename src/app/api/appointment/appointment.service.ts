import { CreateAppointmentDto } from "./appointent.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { GoogleCalendarClient } from "../../../integrations/google-calendar.client";

const calendarClient = new GoogleCalendarClient();

export async function createAppointment(data: CreateAppointmentDto) {
  return await calendarClient.createEvent({
    name: "Nuevo appointment",
    start: data.start,
    end: data.end,
  });
  /*const newAppointment = {
    id: inMemoryStore.appointments.length + 1,
    start: data.start,
    end: data.end,
    eventId: "API Calendar Event ID",
    patientId: data.patientId,
  };
  inMemoryStore.appointments.push(newAppointment);
  return newAppointment;*/
}

export async function getAllAppointments() {
  return await calendarClient.listEvents(new Date(), 10);
}

export function getAppointmentById(id: number) {
  return inMemoryStore.appointments.find((appointent) => appointent.id === id);
}
