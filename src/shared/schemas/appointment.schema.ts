import { z } from "zod";

export const createAppointmentSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  start: z.iso.datetime({ local: true }),
  end: z.iso.datetime({ local: true }),
  patientId: z.coerce.number().positive(),
});

export const getAppointmentSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  patientId: z.coerce.number().positive().optional(),
});

export const patchAppointmentSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    start: z.string().optional(),
    end: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type GetAppointmentDTO = z.infer<typeof getAppointmentSchema>;
export type PatchAppointmentDTO = z.infer<typeof patchAppointmentSchema>;
