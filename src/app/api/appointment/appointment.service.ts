import {
  CreateAppointmentDTO,
  GetAppointmentDTO,
  PatchAppointmentDTO,
} from "@/shared/schemas/appointment.schema";
import { GoogleCalendarClient } from "@/integrations/google-calendar.client";
import { getPatientById } from "../patient/patient.service";
import { sendNotification } from "@/lib/notification/notification.service";
import { AppError } from "../core/errors/appCustomError";
import { Appointment } from "./appointment.model";
import { findUserByUserId } from "../user/user.service";
import { handlePrismaError } from "@/lib/database/prismaErrorHandler";
import prisma from "@/lib/database/prisma";

/* -- CREATE -- */

export async function createAppointment(userId: number, appointmentData: CreateAppointmentDTO) {
  try {
    const patient = await getPatientById(userId, appointmentData.patientId);
    const calendarClient = await getCalendarClient(userId);
    const eventName = `Turno con ${patient?.name} ${patient?.lastname} `;

    // New event in google calendar
    const event = await calendarClient.createEvent({
      name: eventName,
      start: appointmentData.start,
      end: appointmentData.end,
    });

    if (!event.id) {
      throw new AppError("Error in event creation", 400);
    }

    // New appointment in DB
    const newAppointment = await prisma.appointment.create({
      data: {
        name: appointmentData.name,
        description: appointmentData.description,
        start: new Date(appointmentData.start),
        end: new Date(appointmentData.end),
        eventId: event.id,
        userId,
        patientId: appointmentData.patientId,
        reminderSent: false,
      },
    });

    // Generate wa.link tiny URL (same behaviour as before, without Twilio)
    const whatsappLink = await sendNotification(patient, newAppointment, "create");

    return { appointment: newAppointment, whatsappLink };
  } catch (error: any) {
    handlePrismaError(error);
  }
}

/* -- READ -- */

export async function getAppointments(userId: number, params: GetAppointmentDTO) {
  try {
    const { start, end, patientId } = params;

    const appointments = await prisma.appointment.findMany({
      where: {
        userId,
        ...(patientId && { patientId }),
        ...(start && {
          start: { gte: new Date(start) },
        }),
        ...(end && {
          end: { lte: new Date(end) },
        }),
      },
    });
    return appointments;
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getAppointmentByEventId(userId: number, eventId: string) {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        userId,
        eventId,
      },
    });
    return appointment;
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getAppointmentById(userId: number, id: number) {
  try {
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
      },
    });
    return appointment;
  } catch (error) {
    handlePrismaError(error);
  }
}

/* -- UPDATE -- */

export async function updateAppointment(
  userId: number,
  eventId: string,
  data: PatchAppointmentDTO,
) {
  try {
    // Validate ownership and existence
    const appointment = await validateBeforeEdit(userId, eventId);

    // DB update
    const updatedAppointment = await prisma.appointment.update({
      where: { eventId },
      data: {
        start: data.start ? new Date(data.start) : appointment.start,
        end: data.end ? new Date(data.end) : appointment.end,
        name: data.name !== undefined ? data.name : appointment.name,
        description: data.description !== undefined ? data.description : appointment.description,
      },
    });

    // Get patient for notification
    const patient = await getPatientById(userId, updatedAppointment.patientId);

    // Google Calendar update
    const calendarClient = await getCalendarClient(userId);
    await calendarClient.editEvent(eventId, {
      start: data.start,
      end: data.end,
    });

    // Generate wa.link notification link
    const whatsappLink = await sendNotification(patient, updatedAppointment, "update");

    return { appointment: updatedAppointment, whatsappLink };
  } catch (error) {
    handlePrismaError(error);
  }
}

/* -- DELETE -- */

export async function deleteAppointment(userId: number, eventId: string) {
  try {
    // Validate ownership and existence, and return appointment
    const appointment = await validateBeforeEdit(userId, eventId);

    // FInd patient for notification
    const patient = await getPatientById(userId, appointment.patientId);

    // DB delete
    // TODO soft delete to keep record of past appointments and avoid issues with Google Calendar sync
    await prisma.appointment.delete({
      where: { eventId },
    });

    // Google Calendar delete
    const calendarClient = await getCalendarClient(userId);
    await calendarClient.deleteEvent(eventId);

    // Generate wa.link notification link
    await sendNotification(patient, appointment, "delete");

    return appointment;
  } catch (error) {
    handlePrismaError(error);
  }
}

/* Helper functions */
async function getCalendarClient(userId: number) {
  const user = await findUserByUserId(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.refreshToken) {
    throw new AppError("Google not linked", 400);
  }
  return new GoogleCalendarClient(user.refreshToken);
}

export async function findAppointmentsToRemind() {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return await prisma.appointment.findMany({
    where: {
      start: { gte: now, lte: in24Hours },
      reminderSent: false,
    },
  });
}

export async function markReminderSent(userId: number, id: number) {
  await prisma.appointment.updateMany({
    where: { id, userId },
    data: { reminderSent: true },
  });
}

export async function validateBeforeEdit(userId: number, eventId: string): Promise<Appointment> {
  const appointment = await prisma.appointment.findFirst({
    where: { eventId }, // eventId es único global
  });

  if (!appointment) {
    throw new AppError("Appointment not found", 404);
  }

  if (appointment.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }
  return appointment as unknown as Appointment;
}
