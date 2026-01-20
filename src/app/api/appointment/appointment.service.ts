import { CreateAppointmentDto } from "./appointent.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { GoogleCalendarClient } from "../../../integrations/google-calendar.client";
import { getPatientById } from "../patient/patient.service";
import { TwilioClient } from "../../../integrations/twilio.client";
import { buildAppointmentMessage } from "./appointment.notification";
import { Appointment } from "./appointment.model";
import { Patient } from "../patient/patient.model";

const calendarClient = new GoogleCalendarClient();
const twilioClient = new TwilioClient();

export async function createAppointment(data: CreateAppointmentDto) {
  const patient = getPatientById(data.patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }
  const message = `New appointment with ${patient?.name} ${patient?.lastName} `;
  const event = await calendarClient.createEvent({
    name: message,
    start: data.start,
    end: data.end,
  });

  if (!event.id) {
    throw new Error("Calendar event was created without ID");
  }
  const newAppointment = {
    id: inMemoryStore.appointments.length + 1,
    start: data.start,
    end: data.end,
    eventId: event.id,
    patientId: data.patientId,
  };
  inMemoryStore.appointments.push(newAppointment);
  await sendNotificationMessage(patient, newAppointment);
  return newAppointment;
}

export async function getAllAppointments() {
  return inMemoryStore.appointments;
}

export async function getCalendarEvents(dateStart: Date, maxResults: number) {
  return await calendarClient.listEvents(dateStart, maxResults);
}

export function getAppointmentById(id: number) {
  return inMemoryStore.appointments.find((appointent) => appointent.id === id);
}

export async function sendNotificationMessage(patient: Patient, appointment: Appointment) {
  const message = buildAppointmentMessage({
    patientName: patient.name,
    professionalName: "Mama de sabri",
    date: appointment.start,
  });

  await twilioClient.sendMessage(process.env.TWILIO_WHATSAPP_FROM!, patient.phone, message);
}
