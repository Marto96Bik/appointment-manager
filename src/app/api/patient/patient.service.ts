import { CreatePatientDTO, getPatientDTO, patchPatientDTO } from "./patient.dto";
import { inMemoryStore } from "../../../lib/inMemoryStore";
import { AppError } from "../core/errors/appCustomError";
import { Patient } from "./patient.model";

export function createPatient(userId: number, data: CreatePatientDTO) {
  patientExists(userId, data.documentId);
  const newPatient = {
    id: inMemoryStore.patients.length + 1,
    ...data,
    userId: userId,
  };
  inMemoryStore.patients.push(newPatient);
  return newPatient;
}

export function getPatientById(userId: number, patientId: number) {
  const patient = inMemoryStore.patients.find((p) => p.userId === userId && p.id === patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  return patient;
}

export function getPatientsList(userId: number, filters: getPatientDTO) {
  // Filter by user
  const userPatients = inMemoryStore.patients.filter((patient) => patient.userId === userId);

  // Filter by params
  const filteredPatients = userPatients.filter((patient) => {
    return (
      (!filters.name || patient.name?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.lastname ||
        patient.lastname?.toLowerCase().includes(filters.lastname.toLowerCase())) &&
      (!filters.phone || patient.phone === filters.phone) &&
      (!filters.documentId || patient.documentId === filters.documentId)
    );
  });

  return filteredPatients;
}

export function updatePatient(userId: number, patientId: number, data: patchPatientDTO) {
  const index = getIndexByPatientId(userId, patientId);
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

export function deletePatient(userId: number, patientId: number) {
  // TODO soft delete
  const index = getIndexByPatientId(userId, patientId);
  inMemoryStore.patients.splice(index, 1);
  return inMemoryStore.patients;
}

function patientExists(userId: number, documentId: string) {
  if (inMemoryStore.patients.some((p) => p.userId === userId && p.documentId === documentId)) {
    throw new AppError("Patient already exists", 400);
  }
}

function getIndexByPatientId(userId: number, patientId: number) {
  const index = inMemoryStore.patients.findIndex((p) => p.userId === userId && p.id === patientId);
  if (index === -1) {
    throw new AppError("Patient not found", 404);
  }
  return index;
}
