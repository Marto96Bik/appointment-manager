import { CreatePatientDto } from "./patient.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { error } from "console";
import { logger } from "@/lib/logger";

export function createPatient(data: CreatePatientDto) {
  patientExists(data.documentId);
  const newPatient = {
    id: inMemoryStore.patients.length + 1,
    ...data,
  };
  inMemoryStore.patients.push(newPatient);
  return newPatient;
}

export function getAllPatients() {
  return inMemoryStore.patients;
}

export function getPatientById(id: number) {
  const patient = inMemoryStore.patients.find((patient) => patient.id === id);
  return patient;
}

function patientExists(documentId: string) {
  if (inMemoryStore.patients.some((patient) => patient.documentId === documentId)) {
    throw new Error("Patient with this data already exists");
  }
}
