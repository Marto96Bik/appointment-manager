"use client";
import { useState, useEffect } from "react";
import AppointmentList from "./appointmentList";
import { inMemoryStore } from "../../lib/inMemoryStore";

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
  const appointmentsData = inMemoryStore.appointments;

  useEffect(() => {
    fetch(appointmentsData)
      .then((response) => response.json())
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <AppointmentList Appointments={appointments} />
    </>
  );
}
