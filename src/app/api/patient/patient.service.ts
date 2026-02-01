import { CreatePatientDto, getPatientDto } from "./patient.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { AppError } from "../core/errors/appCustomError";

export function createPatient(data: CreatePatientDto) {
  patientExists(data.documentId);
  const newPatient = {
    id: inMemoryStore.patients.length + 1,
    ...data,
  };
  inMemoryStore.patients.push(newPatient);
  return newPatient;
}

export function getPatientById(id: number) {
  const patient = inMemoryStore.patients.find((patient) => patient.id === id);
  return patient;
}

export function getPatientsList(filters: getPatientDto) {
  const patient = inMemoryStore.patients.filter((patient) => {
    return (
      (!filters.id || patient.id === filters.id) &&
      (!filters.name || patient.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.lastname ||
        patient.lastName.toLowerCase().includes(filters.lastname.toLowerCase())) &&
      (!filters.phone || patient.phone === filters.phone) &&
      (!filters.documentId || patient.documentId === filters.documentId)
    );
  });
  return patient;
}

function patientExists(documentId: string) {
  if (inMemoryStore.patients.some((patient) => patient.documentId === documentId)) {
    throw new AppError("Patient already exists", 400);
  }
}
