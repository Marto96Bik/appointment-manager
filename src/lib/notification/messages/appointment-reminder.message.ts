import { AppointmentMessageStrategy } from "../appointment-message.strategy";
import { formatDateTime } from "../../datetime";
import { AppointmentMessageData } from "../types/appointment-message.types";

export class AppointmentReminderMessage implements AppointmentMessageStrategy {
  build(data: AppointmentMessageData): string {
    const { formattedDate, formattedTime } = formatDateTime(data.date);
    return `Hola ${data.patientName}! Este es un recordatorio de tu turno con ${data.professionalName} el ${formattedDate} a las ${formattedTime} hs.
    Por favor, no olvides asistir. ¡Te esperamos!`;
  }
}
