// context/ItemContext.js
import { Appointment } from '@/components/appointment';
import { createContext, ReactNode, useContext, useState } from 'react';

// define how other screens should interact with this file (what they will see as parameters)
interface AppointmentContextType{
  appointments: Appointment[];
  addAppt: (name: string, address: string, date: string, 
    arrivalTime: string, eta: string, transport_type: string, repeat: string[]) => void;
}

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined); // allows sharing data across components

interface props {children: ReactNode} // makes the below function happy for type checking
export function AppointmentProvider({ children }: props) {
  const [appointments, SetAppts] = useState<Appointment[]>([]);

  const addAppt = (name: string, address: string, date: string, 
    arrivalTime: string, eta: string, transport_type: string, repeat: string[]) => {
    // define its repeat pattern
    let repeats = null;//: Appointment.Repeat = {days: [], period: 1};
    if(repeat.length > 1){
      repeats = {
        days: repeat, // days of the week this appointment happens
        period: 1, // repeat every 1 week
      };
    }
    const newAppt = new Appointment(name, address, date, arrivalTime, eta, transport_type, repeats, SetAppts);
    //setAppts(prev => [...prev, newAppt]); // this is done inside the Appointment constructor, for abstraction's sake
  };

  return (
    <AppointmentContext.Provider value={{ appointments, addAppt }}>
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