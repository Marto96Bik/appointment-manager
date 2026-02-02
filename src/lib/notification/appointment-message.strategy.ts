import { AppointmentMessageData } from "./types/appointment-message.types";

export interface AppointmentMessageStrategy {
  build(data: AppointmentMessageData): string;
}
