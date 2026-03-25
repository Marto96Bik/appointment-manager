import { AppointmentMessageStrategy } from "../appointment-message.strategy";
import { formatDateTime } from "../../utils/datetime";
import { AppointmentMessageData } from "../types/appointment-message.types";

export class AppointmentUpdateMessage implements AppointmentMessageStrategy {
  build(data: AppointmentMessageData): string {
    const { formattedDate, formattedTime } = formatDateTime(data.date);
    return `Hola ${data.patientName}! ✏️ Tu turno con ${data.professionalName} fue modificado para el ${formattedDate} a las ${formattedTime} hs.`;
  }
}
