import { z } from "zod";

export const createAppointmentSchema = z.object({
  start: z.iso.datetime({ local: true }),
  end: z.iso.datetime({ local: true }),
  patientId: z.number().positive(),
});

export const getAppointmentsSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  patientId: z.coerce.number().positive().optional(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
export type GetAppointmentsDto = z.infer<typeof getAppointmentsSchema>;
