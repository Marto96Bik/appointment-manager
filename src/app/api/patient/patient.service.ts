import { CreatePatientDto, getPatientDto, patchPatientDto } from "./patient.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { AppError } from "../core/errors/appCustomError";
import { Patient } from "./patient.model";

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
      (!filters.lastName ||
        patient.lastname.toLowerCase().includes(filters.lastName.toLowerCase())) &&
      (!filters.phone || patient.phone === filters.phone) &&
      (!filters.documentId || patient.documentId === filters.documentId)
    );
  });
  return patient;
}

export function editPatient(patientId: number, data: patchPatientDto) {
  const index = inMemoryStore.patients.findIndex((p) => p.id === patientId);

  if (index === -1) {
    throw new AppError("Patient not found", 404);
  }

  const patient = inMemoryStore.patients[index];

  const updatedPatient: Patient = {
    ...patient,
    name: data.name ?? patient.name,
    lastname: data.lastname ?? patient.lastname,
    phone: data.phone ?? patient.phone,
    documentId: data.documentId ?? patient.documentId,
  };

  inMemoryStore.patients[index] = updatedPatient;
  return updatedPatient;
}

export function deletePatient(patientId: number) {
  // TODO soft delete

  const index = inMemoryStore.patients.findIndex((a) => a.id === patientId);

  if (index === -1) {
    throw new AppError("Patient not found", 404);
  }

  inMemoryStore.patients.splice(index, 1);

  return inMemoryStore.patients;
}

function patientExists(documentId: string) {
  if (inMemoryStore.patients.some((patient) => patient.documentId === documentId)) {
    throw new AppError("Patient already exists", 400);
  }
}
