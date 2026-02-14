import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(1),
  documentId: z.string(),
});

export const getPatientSchema = z.object({
  name: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  documentId: z.string().min(1).optional(),
});

export const patchPatientSchema = z.object({
  name: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  documentId: z.string().min(1).optional(),
});

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type getPatientDTO = z.infer<typeof getPatientSchema>;
export type patchPatientDTO = z.infer<typeof patchPatientSchema>;
