export type NotificationType = "create" | "update" | "delete";

export type AppointmentMessageData = {
  patientName: string;
  professionalName: string;
  date: string | Date;
};
