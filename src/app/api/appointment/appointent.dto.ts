import { z } from "zod";

export const createAppointmentSchema = z.object({
  start: z.iso.datetime({ local: true }),
  end: z.iso.datetime({ local: true }),
  patientId: z.number().positive(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;
