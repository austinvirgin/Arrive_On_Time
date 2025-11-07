import { Appointment } from '@/components/appointment';
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Menubar from "../components/Menubar";
import * as Notifications from "expo-notifications";

export default function Index() {
  const [appts, makeAppt] = useState<Appointment[]>([]); // initialize an empty list of appointments. Use makeAppt() to modify the list

  // makeAppt is defined from useState above
  // @ts-ignore
  const AddAppt = async () => {
    // This function adds an appointment to the list

    // define its repeat pattern, or instead make repeat = null if there is no repeat to this appointment
    const repeats: Appointment.Repeat = {
      days:['mon','wed','fri'], // days of the week this appointment happens
      period:1, // repeat every 1 week
    };

    // make new appointment (including supplying the function that allows for adding an appointment to the appts list: "makeAppt")
    const newAppt = new Appointment("class", "STC", 'Oct 11', '11am', repeats, makeAppt); // appointment info here

    // --- NEW: Schedule a local notification for 10 seconds from now (demo)
    const trigger: Notifications.TimeIntervalTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10,
      repeats: false,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Appointment Reminder",
        body: `Upcoming: ${newAppt.name} at ${newAppt.time}`,
      },
      trigger,
    });
  }; // ✅ closes AddAppt properly

  return (
    <View style={styles.root}>
      <Menubar menuTitle="Date/Time:" />
      <View style={styles.center}>
        <View style ={styles.buttonContainer}>
          <Pressable style = {styles.button} onPress={AddAppt}>
            <Text style={styles.buttonLabel}>Create Appointment</Text>
          </Pressable>
        </View> 
        <Text>Known Appointments:</Text>
        {// below is how to display each item in the list. Define data = {list}, 
           // renderItem expects a function with 1 parameter, a placeholder name that will represent the current item of the list 
           }
        <FlatList
          data={appts}
          renderItem={({ item }) => (
            <Text style={{ fontSize: 18 }}>{item.getSummary()}</Text>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: {
    marginVertical: 20,
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#3dff81ff',
    borderRadius: 18,
    fontSize: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#25292e',
    fontSize: 16,
  },
});
