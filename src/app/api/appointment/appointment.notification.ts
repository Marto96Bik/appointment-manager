import { formatDateTime } from "../../../lib/datetime";

type AppointmentMessageData = {
  patientName: string;
  professionalName: string;
  date: string | Date;
};

export function buildAppointmentMessage(data: AppointmentMessageData) {
  const { formattedDate, formattedTime } = formatDateTime(data.date);
  return `Hola ${data.patientName}! 👋. Se te ha agendado para una turno con ${data.professionalName} el día ${formattedDate} a las ${formattedTime} hs. 🗓️`;
}
