import { Suspense } from "react";
import CreateAppointmentComponent from "./createAppointment";
import Loader from "@/app/components/loader";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
          <h1 className="text-xl font-bold mb-4">Asignar Turno</h1>
          <Loader />
        </div>
      }
    >
      <CreateAppointmentComponent />
    </Suspense>
  );
}
