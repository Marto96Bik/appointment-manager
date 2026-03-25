import { AppointmentMessageStrategy } from "../appointment-message.strategy";
import { AppointmentMessageData } from "../types/appointment-message.types";

export class AppointmentDeleteMessage implements AppointmentMessageStrategy {
  build(data: AppointmentMessageData): string {
    return `Hola ${data.patientName}. Tu turno con ${data.professionalName} ha sido cancelado.`;
  }
}
