import { AppointmentProvider } from "@/context/AppointmentContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return( 
    <AppointmentProvider>
      <Stack />
    </AppointmentProvider>
  );
}
