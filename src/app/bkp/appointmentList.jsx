import Appointment from "./appointment";

export default function AppointmentList(props) {
  return (
    <div className="container mx-auto px-4 py-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5">
        {props.Appointments.map((appointment) => {
          return (
            <Appointment
              key={index}
              Id={appointment._id}
              ProjectName={appointment.name}
              Cost={appointment.cost_investment}
              Info={appointment.info}
            />
          );
        })}
      </ul>
    </div>
  );
}
