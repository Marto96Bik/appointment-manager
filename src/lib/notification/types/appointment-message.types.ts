export type NotificationType = "create" | "update" | "delete" | "reminder";

export type AppointmentMessageData = {
  patientName: string;
  professionalName: string;
  date: string | Date;
};
