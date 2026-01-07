import { CreateAppointmentDto } from "./appointent.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";

export function createAppointment(data: CreateAppointmentDto) {
  const newAppointment = {
    id: inMemoryStore.appointments.length + 1,
    start: data.start,
    end: data.end,
    eventId: "API Calendar Event ID",
    patientId: data.patientId,
  };
  inMemoryStore.appointments.push(newAppointment);
  return newAppointment;
}

export function getAllAppointments() {
  return inMemoryStore.appointments;
}

export function getAppointmentById(id: number) {
  return inMemoryStore.appointments.find((appointent) => appointent.id === id);
}
