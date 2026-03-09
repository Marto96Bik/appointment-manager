import { AppointmentMessageStrategy } from "../appointment-message.strategy";
import { formatDateTime } from "../../utils/datetime";
import { AppointmentMessageData } from "../types/appointment-message.types";

export class AppointmentCreateMessage implements AppointmentMessageStrategy {
  build(data: AppointmentMessageData): string {
    const { formattedDate, formattedTime } = formatDateTime(data.date);
    return `Hola ${data.patientName}! 👋 Se te agendó un turno con ${data.professionalName} el día ${formattedDate} a las ${formattedTime} hs. 🗓️`;
  }
}
