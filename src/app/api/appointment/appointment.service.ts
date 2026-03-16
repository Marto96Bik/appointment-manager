import {
  CreateAppointmentDTO,
  GetAppointmentDTO,
  PatchAppointmentDTO,
} from "@/schema/appointment.schema";
import { GoogleCalendarClient } from "@/integrations/google-calendar.client";
import { getPatientById } from "../patient/patient.service";
import { sendNotification } from "@/lib/notification/notification.service";
import { AppError } from "../../../lib/errors/appCustomError";
import { Appointment } from "@prisma/client";
import { findUserByUserId } from "../user/user.service";
import { handlePrismaError } from "@/lib/errors/prismaErrorHandler";
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

    const startDate = parseAndValidateDate(appointmentData.start, "start");
    const endDate = parseAndValidateDate(appointmentData.end, "end");

    if (startDate >= endDate) {
      throw new AppError("Appointment end must be after start", 400);
    }

    // New appointment in DB
    const newAppointment = await prisma.appointment.create({
      data: {
        name: appointmentData.name,
        description: appointmentData.description,
        start: startDate,
        end: endDate,
        eventId: event.id,
        userId,
        patientId: appointmentData.patientId,
        reminderSent: false,
      },
    });

    const professional = await findUserByUserId(userId);
    // Generate wa.link tiny URL (same behaviour as before, without Twilio)
    const whatsappLink = await sendNotification(
      patient,
      newAppointment,
      "create",
      `${professional!.name} ${professional!.lastname}`,
    );

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
      orderBy: {
        id: "asc",
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

    const startDate = data.start ? parseAndValidateDate(data.start, "start") : appointment.start;
    const endDate = data.end ? parseAndValidateDate(data.end, "end") : appointment.end;

    if (startDate >= endDate) {
      throw new AppError("Appointment end must be after start", 400);
    }

    // DB update
    const updatedAppointment = await prisma.appointment.update({
      where: { eventId },
      data: {
        start: startDate,
        end: endDate,
        name: data.name !== undefined ? data.name : appointment.name,
        description: data.description !== undefined ? data.description : appointment.description,
        patientId: data.patientId !== undefined ? data.patientId : appointment.patientId,
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

    const professional = await findUserByUserId(userId);
    // Generate wa.link notification link
    const whatsappLink = await sendNotification(
      patient,
      updatedAppointment,
      "update",
      `${professional!.name} ${professional!.lastname}`,
    );

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

    const professional = await findUserByUserId(userId);
    // Generate wa.link notification link
    await sendNotification(
      patient,
      appointment,
      "delete",
      `${professional!.name} ${professional!.lastname}`,
    );

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
  const in36Hours = new Date(now.getTime() + 36 * 60 * 60 * 1000);

  return await prisma.appointment.findMany({
    where: {
      start: { gte: now, lte: in36Hours },
      reminderSent: false,
    },
    orderBy: {
      id: "asc",
    },
  });
}

export async function findAppointmentReminderPending(userId: number) {
  const professional = await findUserByUserId(userId);

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      reminderPending: true,
    },
    select: {
      id: true,
      start: true,
      eventId: true,
      patient: {
        select: {
          id: true,
          name: true,
          lastname: true,
          phone: true,
          documentId: true,
          userId: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });

  const result = await Promise.all(
    appointments.map(async (apt) => {
      const whatsappLink = await sendNotification(
        apt.patient,
        apt,
        "reminder",
        `${professional!.name} ${professional!.lastname}`,
      );

      return {
        id: apt.id,
        start: apt.start,
        patientFullName: `${apt.patient.name} ${apt.patient.lastname}`,
        whatsappLink,
        eventId: apt.eventId,
      };
    }),
  );

  return result;
}

export async function markReminderPending(userId: number, id: number) {
  await prisma.appointment.updateMany({
    where: { id, userId },
    data: { reminderPending: true },
  });
}

export async function markReminderSent(userId: number, eventId: string) {
  await prisma.appointment.updateMany({
    where: { userId, eventId },
    data: { reminderPending: false, reminderSent: true },
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

function parseAndValidateDate(value: string | Date | undefined, label: string): Date {
  if (value === undefined) {
    throw new AppError(`${label} date is required`, 400);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid ${label} date`, 400);
  }

  return date;
}
