import {
  AppointmentCreateMessage,
  AppointmentUpdateMessage,
  AppointmentDeleteMessage,
} from "./messages";
import { AppointmentMessageData, NotificationType } from "./types/appointment-message.types";

export function buildMessage(data: AppointmentMessageData, type: NotificationType): string {
  const strategy = getStrategy(type);
  return strategy.build(data);
}

function getStrategy(type: NotificationType) {
  switch (type) {
    case "create":
      return new AppointmentCreateMessage();
    case "update":
      return new AppointmentUpdateMessage();
    case "delete":
      return new AppointmentDeleteMessage();
    default:
      throw new Error("Unsupported message type");
  }
}
