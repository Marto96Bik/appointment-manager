const globalAny: any = globalThis as any;

globalAny.patients = globalAny.patients || [];

export const patients: any[] = globalAny.patients;

export function createPatient(data: { firstName: string; lastName: string; email: string }) {
  const newPatient = {
    id: patients.length + 1, // simple autoincrement
    ...data,
  };
  patients.push(newPatient);
  return newPatient;
}

// opcional: obtener todos los pacientes
export function getAllPatients() {
  return patients;
}

export function getPatientById(id: number) {
  const patient = patients.find((patient) => patient.id === id);
  return patient;
}
