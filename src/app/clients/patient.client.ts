import { Patient } from "@prisma/client";
import { AppError } from "@/lib/errors/appCustomError";

export async function fetchPatients(): Promise<Patient[]> {
  const res = await fetch("/api/patient");
  if (!res.ok) {
    throw new AppError("Failed to fetch patients", res.status);
  }
  return res.json();
}

export async function fetchPatient(id: number): Promise<Patient> {
  const res = await fetch(`/api/patient/${id}`);
  if (!res.ok) {
    throw new AppError("Failed to fetch patient", res.status);
  }
  return res.json();
}
