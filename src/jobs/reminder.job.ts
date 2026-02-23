import { getPatientById } from "../app/api/patient/patient.service";
import { AppError } from "../app/api/core/errors/appCustomError";
import {
  findAppointmentsToRemind,
  markReminderSent,
} from "@/app/api/appointment/appointment.service";
import { sendNotification } from "@/lib/notification/notification.service";

export async function runReminderJob() {
  console.log("Running reminder job...");

  const appointments = await findAppointmentsToRemind();

  for (const appointment of appointments) {
    try {
      const patient = getPatientById(appointment.userId, appointment.patientId);
      await sendNotification(patient!, appointment, "reminder");
      await markReminderSent(appointment.id);
    } catch (error) {
      throw new AppError("Error sending reminder", 400);
    }
  }
}
