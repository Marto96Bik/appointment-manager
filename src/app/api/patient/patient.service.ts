import { CreatePatientDto } from "./patient.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";

export function createPatient(data: CreatePatientDto) {
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
