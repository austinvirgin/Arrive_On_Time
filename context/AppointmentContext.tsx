// context/ItemContext.js
import { Appointment } from '@/components/appointment';
import { createContext, ReactNode, useContext, useState } from 'react';

// define how other screens should interact with this file (what they will see as parameters)
interface AppointmentContextType{
    appointments: Appointment[];
    addAppt: (name: string, address: string, date: string, 
        arrivalTime: string, eta: string, transport_type: string, starting_address: string, repeat: string[]) => void;
    removeAppt: (index: number) => void;
    modifyAppt: (index:number, name: string, address: string, date: string, 
        arrivalTime: string, eta: string, transport_type: string, starting_address: string, repeat: string[]) => void;
}

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined); // allows sharing data across components

interface props {children: ReactNode} // makes the below function happy for type checking
export function AppointmentProvider({ children }: props) {
    // This export function keeps an internal list of appointments, and provides functions for modifying the list (add/delete/replace).
    const [appointments, SetAppts] = useState<Appointment[]>([]);
    // function for removing appointment by index number. Returns the new updated list.
    const removeAppt = (index: number) => {
        const filtered_appts = appointments.filter((appt, i) => i !== index); // filter and keep every appointment but the one at this index
        SetAppts(filtered_appts); // this will update the appointments list only on next render, not immediately
        return filtered_appts; // returns the updated appointments list
    };
    // function for replacing an appointment in the appointments list by index number. Returns the new updated list.
    const modifyAppt = (index: number, name: string, address: string, date: string, 
        arrivalTime: string, eta: string, transport_type: string, starting_address: string, repeat: string[]) => {
        const updated_appt = new Appointment(name, address, date, arrivalTime, eta, transport_type, starting_address, repeat);
        const updated_appts = appointments.map((appt, i) =>{
            if (i == index) {
                return updated_appt; // swap out for new appointment
            }
            else {
                return appt;
            }
        })
        SetAppts(updated_appts); // this will update the appointments list only on next render, not immediately
        return updated_appts; // returns the updated appointments list
    };
    // Adds a new appointment to the end of the appointments list. Returns the new updated list.
    const addAppt = (name: string, address: string, date: string, 
        arrivalTime: string, eta: string, transport_type: string, starting_address: string, repeat: string[]) => {
        const newAppt = new Appointment(name, address, date, arrivalTime, eta, transport_type, starting_address, repeat);
        const new_appts_list = [...appointments, newAppt];
        SetAppts(new_appts_list); // this will update the appointments list only on next render, not immediately
        return new_appts_list; // return the updated appointments list
    };

    // return the XML information for the app
    return (
        <AppointmentContext.Provider value={{ appointments, addAppt, removeAppt, modifyAppt }}>
            {children}
        </AppointmentContext.Provider>
    );
}

export const useAppointmentContext = (): AppointmentContextType => {
    const context = useContext(AppointmentContext);
    if(!context){
        throw new Error("useAppointmentContext must be used within an AppointmentProvider")
    }
    return context;
};