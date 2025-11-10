import { Appointment } from '@/components/appointment';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { appointments, addAppt } = useAppointmentContext(); // this enables persistent appointment data across screens
  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style = {styles.hintText}>Known Appointments:</Text>
        {
          appointments.map((item: Appointment, index: number) => (
            <View style={{marginVertical:5}} key = {index}>
                <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} onPress={() => {
                    router.push({
                        pathname: "/create",
                        params: {app_num: index}
                    });
                }}>
                    <View style = {{flexDirection:'column', paddingHorizontal:20}}>
                        <Text style={{color: '#fff', fontSize: 20}}>{item.name}</Text> 
                        <Text style={{color: '#fff', fontSize: 14}}> @ {item.address}</Text>
                    </View>
                    <Text style={{color: '#fff', fontSize: 24, textAlign:'right', paddingRight:20}}>{item.time}</Text>
                </TouchableOpacity>
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#6f6f6f",
    width: '100%',
    height: 68,
    alignItems: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
