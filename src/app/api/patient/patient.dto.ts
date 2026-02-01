import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(1),
  documentId: z.string(),
});

export const getPatientSchema = z.object({
  id: z.coerce.number().positive().optional(),
  name: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  documentId: z.string().min(1).optional(),
});

export type CreatePatientDto = z.infer<typeof createPatientSchema>;
export type getPatientDto = z.infer<typeof getPatientSchema>;
