import { z } from "zod";

export const createAppointmentSchema = z.object({
  start: z.iso.datetime(),
  end: z.iso.datetime(),
  patientId: z.number().positive(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
