// context/ItemContext.js
import { Appointment } from '@/components/appointment';
import { createContext, ReactNode, useContext, useState } from 'react';

// define how other screens should interact with this file (what they will see as parameters)
interface AppointmentContextType{
  appointments: Appointment[];
  addAppt: (name: string, address: string) => void;
}

export const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined); // allows sharing data across components

interface props {children: ReactNode} // makes the below function happy for type checking
export function AppointmentProvider({ children }: props) {
  const [appointments, SetAppts] = useState<Appointment[]>([]);

  const addAppt = (name: string, address: string) => {
    // define its repeat pattern, or instead make repeat = null if there is no repeat to this appointment
    const repeats = {
        days:['mon','wed','fri'], // days of the week this appointment happens
        period:1, // repeat every 1 week
    }
    const newAppt = new Appointment(name, address, "10/27/2025", "11am", repeats, SetAppts);
    //setAppts(prev => [...prev, newAppt]); // this is done inside the Appointment constructor, for abstraction
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