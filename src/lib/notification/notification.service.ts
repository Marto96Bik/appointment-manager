import { Appointment } from "../../app/api/appointment/appointment.model";
import { buildMessage } from "./appointment.notification";
import { Patient } from "../../app/api/patient/patient.model";
import { TwilioClient } from "../../integrations/twilio.client";
import { NotificationType } from "./types/appointment-message.types";

const twilioClient = new TwilioClient();

export async function sendNotification(
  patient: Patient,
  appointment: Appointment,
  type: NotificationType,
) {
  const message = buildMessage(
    {
      patientName: patient.name,
      professionalName: "Mama de sabri",
      date: appointment.start,
    },
    type,
  );

  await twilioClient.sendMessage(process.env.TWILIO_WHATSAPP_FROM!, patient.phone, message);
}
