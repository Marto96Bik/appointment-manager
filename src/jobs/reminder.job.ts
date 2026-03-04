import { getPatientById } from "@/app/api/patient/patient.service";
import {
  findAppointmentsToRemind,
  markReminderSent,
} from "@/app/api/appointment/appointment.service";
import { sendNotification } from "@/lib/notification/notification.service";

export async function runReminderJob() {
  console.log("Running reminder job...", new Date().toISOString());

  const appointments = await findAppointmentsToRemind();

  for (const appointment of appointments) {
    const patient = await getPatientById(appointment.userId, appointment.patientId);

    console.log("Sending notification to:", patient?.name);

    await sendNotification(patient!, appointment, "reminder");
    await markReminderSent(appointment.id);
  }

  console.log("Reminder job finished");
}
