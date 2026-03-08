export interface Appointment {
  id: number;
  name: string;
  description: string;
  start: string;
  end: string;
  eventId: string;
  patientId: number;
  userId: number;
  reminderSent: boolean;
}
