import asyncStorage from '@react-native-async-storage/async-storage';
import { useAppointmentContext } from "../context/AppointmentContext";

export default function Startup() {
    const { appointments, addAppt, removeAppt, modifyAppt } = useAppointmentContext(); // this enables persistent appointment data across screens
  
    //just in case
    // const ClearAppointments = async () => {
    //     await asyncStorage.removeItem('appointments');
    //     console.log('Appointments cleared');
    // }
    // ClearAppointments();

    // grabs any stored appointments on startup, then loads them into the app.
    asyncStorage.getItem('appointments').then((data) => {
        if (data !== null) {
            alert("Loaded saved appointments.");
            const parsedData = JSON.parse(data);
            parsedData.forEach((appt) => { 
                // converted parsed into appointments
                addAppt(appt.name, 
                    appt.address, 
                    appt.date, 
                    appt.arrivalTime,
                    appt.eta,
                    appt.transport_type,
                    appt.starting_address,
                    appt.repeat
                );
            });
        }
    });
    return null;
}