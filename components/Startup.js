
/*
    Simple Startup component:
    - Reads the "appointmentsList" from localStorage (if present)
    - Parses it and passes it to the provided setAppointments callback

    Usage:
        <Startup setAppointments={setAppointments} />
*/

const appointmentsList = [];

export default function Startup() {
    //retrieve and parse appointments list from localStorage if it exists there
    const appointString = localStorage.getItem('appointmentsList');
    if (appointString !== null) {
        appointmentsList = JSON.parse(appointString);
    }

    appointmentsList.forEach(appointment => {
         AddAppt(appointment.name, appointment.address, appointment.date, appointment.time, appointment.repeat); 
    }); 
    // This component doesn't render visible UI
    return null;
}