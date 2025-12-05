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
  const [appointments, SetAppts] = useState<Appointment[]>([]);
  const removeAppt = (index: number) => {
    SetAppts(prev => prev.filter((appt, i) => i !== index)); // filter and keep every appointment but the one at this index
  };
  const modifyAppt = (index: number, name: string, address: string, date: string, 
    arrivalTime: string, eta: string, transport_type: string, starting_address: string, repeat: string[]) => {
    SetAppts(prev => {
      const updated = [...prev]; 
      updated[index] = new Appointment(name, address, date, arrivalTime, eta, transport_type, starting_address, repeat);
      return updated;
    }
    );
  };
  const addAppt = (name: string, address: string, date: string, 
    arrivalTime: string, eta: string, transport_type: string, starting_address: string, repeat: string[]) => {
    const newAppt = new Appointment(name, address, date, arrivalTime, eta, transport_type, starting_address, repeat);
    appointments.push(new Appointment(name, address, date, arrivalTime, eta, transport_type, starting_address, repeat));
    SetAppts(prev => [...prev, newAppt]);
  };

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