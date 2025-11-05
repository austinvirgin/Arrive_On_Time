import { Appointment } from '@/components/appointment';
import Startup from "@/components/Startup";
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

var appointmentsList : Appointment[] = []; // initialize an empty list of appointments

export default function Index() {
  Startup();
  const [appts, makeAppt] = useState<Appointment[]>([]); // initialize an empty list of appointments. Use makeAppt() to modify the list
  const AddAppt = () => {
    // define its repeat pattern, or instead make repeat = null if there is no repeat to this appointment
    const repeats: Appointment.Repeat = {
      days:['mon','wed','fri'], // days of the week this appointment happens
      period:1, // repeat every 1 week
    }
    // make new appointment (including supplying the function that allows for adding an appointment to the appts list: "makeAppt")
    const newAppt = new Appointment("class","STC", 'Oct 11', '11am', repeats, makeAppt); // appointment info here
    // add the new appointment to a list of appointments, then save the new list locally
    appointmentsList.push(newAppt);
    localStorage.setItem("appointments", JSON.stringify(appointmentsList));
  }
  
  const router = useRouter();
  const { appointments } = useAppointmentContext(); // this enables persistent appointment data across screens
  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style = {styles.hintText}>Known Appointments:</Text>
        {
          appointments.map((item: Appointment, index: number) => (
            <View key = {index}>
              <Text>{item.getSummary()}</Text>
            </View>
          ))
        }
      </ScrollView>

      <TouchableOpacity style={styles.plusButton} activeOpacity={0.8} onPress={() => {
          router.push("/create");
        }}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#efefef" },
  container: {
    padding: 24,
    paddingBottom: 140
  },
  listSpace: {
    height: 600,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center"
  },
  hintText: {
    color: "#bbb"
  },
  plusButton: {
    position: "absolute",
    right: 28,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: "#6f6f6f",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6
  },
  plusText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28
  }
});
