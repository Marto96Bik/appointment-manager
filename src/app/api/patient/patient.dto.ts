import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  documentId: z.string(),
});

export type CreatePatientDto = z.infer<typeof createPatientSchema>;
