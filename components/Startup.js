import asyncStorage from '@react-native-async-storage/async-storage';

export default function Startup(addAppt) {
    // grabs any stored appointments on startup, then loads them into the app.
    asyncStorage.getItem('appointments').then((data) => {
        if (data !== null) {
            const parsedData = JSON.parse(data);
            parsedData.forEach((appt) => { 
                // converted parsed into appointments
                addAppt(appt.name, 
                    appt.address, 
                    appt.date, 
                    appt.arrivalTime,
                    []
                );
            });
        }
    });
    return null;
}