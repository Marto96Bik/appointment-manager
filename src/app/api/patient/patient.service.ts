import { CreatePatientDTO, getPatientDTO, patchPatientDTO } from "@/schema/patient.schema";
import { AppError } from "@/lib/errors/appCustomError";
import { handlePrismaError } from "@/lib/errors/prismaErrorHandler";
import prisma from "@/lib/database/prisma";

export async function createPatient(userId: number, data: CreatePatientDTO) {
  try {
    const patient = await patientExists(userId, data.documentId);
    if (patient?.deletedAt) {
      const revivedPatient = await prisma.patient.update({
        where: { id: patient.id },
        data: { deletedAt: null, ...data },
      });
      return revivedPatient;
    }

    const newPatient = await prisma.patient.create({
      data: {
        ...data,
        userId: userId,
      },
    });

    return newPatient;
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getPatientById(userId: number, patientId: number) {
  try {
    return validatePatientOwnership(userId, patientId);
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function getPatientsList(userId: number, filters: getPatientDTO) {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        userId,
        deletedAt: null,
        name: filters.name ? { contains: filters.name, mode: "insensitive" } : undefined,
        lastname: filters.lastname
          ? { contains: filters.lastname, mode: "insensitive" }
          : undefined,
        phone: filters.phone || undefined,
        documentId: filters.documentId || undefined,
      },
    });

    return patients;
  } catch (error: any) {
    handlePrismaError(error);
  }
}

export async function updatePatient(userId: number, patientId: number, data: patchPatientDTO) {
  try {
    const patient = await validatePatientOwnership(userId, patientId);

    const updatedPatient = await prisma.patient.update({
      where: {
        id: patientId,
      },
      data: {
        name: data.name ?? patient.name,
        lastname: data.lastname ?? patient.lastname,
        phone: data.phone ?? patient.phone,
        documentId: data.documentId ?? patient.documentId,
      },
    });

    return updatedPatient;
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function deletePatient(userId: number, patientId: number) {
  try {
    const patient = await validatePatientOwnership(userId, patientId);

    await prisma.patient.update({
      where: { id: patientId },
      data: { deletedAt: new Date() },
    });

    return patient;
  } catch (error) {
    handlePrismaError(error);
  }
}

async function patientExists(userId: number, documentId: string) {
  const patient = await prisma.patient.findFirst({
    where: {
      userId,
      documentId,
    },
  });

  return patient;
}

export async function validatePatientOwnership(userId: number, patientId: number) {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });

  if (!patient || patient.deletedAt) {
    throw new AppError("Patient not found or deleted", 404);
  }

  if (patient.userId !== userId) {
    throw new AppError("Unauthorized", 403);
  }

  return patient;
}
