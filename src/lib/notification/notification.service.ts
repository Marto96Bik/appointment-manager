import { buildMessage } from "./appointment.notification";
import { Patient } from "../../app/api/patient/patient.model";
import { WaLinkClient } from "../../integrations/wa-link.client";
import { NotificationType } from "./types/appointment-message.types";

/** Appointment-like object (accepts Prisma result with Date or model with string). */
type AppointmentForNotification = { start: string | Date };

const waLinkClient = new WaLinkClient();

const DEFAULT_COUNTRY_CODE = "972";

/**
 * Generates a wa.link tiny URL with the appointment notification message.
 * Same behaviour as before (triggered on create/update/delete/reminder) but without Twilio.
 * Returns the generated link so callers can include it in the response (e.g. when creating an appointment).
 */
export async function sendNotification(
  patient: Patient,
  appointment: AppointmentForNotification,
  type: NotificationType,
  professionalName: string,
): Promise<string> {
  const message = buildMessage(
    {
      patientName: patient.name,
      professionalName,
      date: appointment.start,
    },
    type,
  );

  const countryCode = process.env.WA_LINK_COUNTRY_CODE ?? DEFAULT_COUNTRY_CODE;
  return waLinkClient.createLink({
    phone: patient.phone,
    countryCode,
    message,
  });
}
