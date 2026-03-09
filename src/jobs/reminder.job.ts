import { getPatientById } from "@/app/api/patient/patient.service";
import {
  findAppointmentsToRemind,
  markReminderSent,
} from "@/app/api/appointment/appointment.service";
import { sendNotification } from "@/lib/notification/notification.service";
import { Appointment } from "@/app/api/appointment/appointment.model";

export async function runReminderJob() {
  const appointments = await findAppointmentsToRemind();

  for (const appointment of appointments) {
    const patient = await getPatientById(appointment.userId, appointment.patientId);

    await sendNotification(patient, appointment as unknown as Appointment, "reminder");
    await markReminderSent(appointment.userId, appointment.id);
  }
}
