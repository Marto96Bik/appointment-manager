import { Patient } from "@/app/api/patient/patient.model";
import { Appointment } from "@/app/api/appointment/appointment.model";

export const inMemoryStore = {
  patients: [] as Patient[],
  appointments: [] as Appointment[],
};
