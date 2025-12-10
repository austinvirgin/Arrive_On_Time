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
                const parsedData = JSON.parse(data);
                loadAppts(parsedData); // give loadAppts (a function from useAppointmentContext()) the parsed json
                // The above function updates the appointments list in a single step, avoiding stale data
            }
        });
    return null;
}