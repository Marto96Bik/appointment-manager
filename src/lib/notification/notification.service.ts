import { Appointment } from "../../app/api/appointment/appointment.model";
import { buildAppointmentMessage } from "../../app/api/appointment/appointment.notification";
import { Patient } from "../../app/api/patient/patient.model";
import { TwilioClient } from "../../integrations/twilio.client";

const twilioClient = new TwilioClient();

export async function sendNotificationMessage(patient: Patient, appointment: Appointment) {
  const message = buildAppointmentMessage({
    patientName: patient.name,
    professionalName: "Mama de sabri",
    date: appointment.start,
  });

  await twilioClient.sendMessage(process.env.TWILIO_WHATSAPP_FROM!, patient.phone, message);
}
