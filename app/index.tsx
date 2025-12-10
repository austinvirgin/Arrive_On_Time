import { Appointment } from '@/components/appointment';
import { NotificationService } from '@/components/NotificationService';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GetDirections } from "../backend/navigateThere";

export default function Index() {
  const router = useRouter();
  const { appointments } = useAppointmentContext();
  const ns = new NotificationService();

  return (
    <View style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.hintText}>Known Appointments:</Text>

        {appointments.map((item: Appointment, index: number) => (
          <View style={{ marginVertical: 5 }} key={index}>
            <View style={styles.rowContainer}>

              {/* MAIN CARD BUTTON */}
              <TouchableOpacity
                style={styles.buttonContainer}
                activeOpacity={0.8}
                onPress={() => {
                  router.push({
                    pathname: "/create",
                    params: { app_num: index }
                  });
                }}
              >
                <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                  <Text style={{ color: '#fff', fontSize: 20 }}>{item.name}</Text>
                  <Text style={{ color: '#fff', fontSize: 14 }}> @ {item.address}</Text>
                </View>

                <View style={{ flexDirection: 'column', paddingHorizontal: 20 }}>
                  <Text style={{ color: '#fff', fontSize: 24, textAlign: 'right' }}>
                    {item.time}
                  </Text>
                  <Text style={{ color: '#fff', fontSize: 12, textAlign: 'right' }}>
                    {item.transit_time}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* NAVIGATE BUTTON */}
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => GetDirections(`${item.address} rexburg`, item.transport_type)}
              >
                <Text style={styles.navText}>Navigate</Text>
                <Text style={styles.navText}>There</Text>
              </TouchableOpacity>

            </View>
          </View>
        ))}

      </ScrollView>

      {/* + Button (Floating Add Button) — STILL HERE */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => router.push("/create")}
      >
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#6f6f6f",
    height: 68,
    marginRight: 5,
    alignItems: 'center',
    padding: 3,
    borderRadius: 10
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginRight: 5,
    marginBottom: 10
  },

  navButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 14,
    height: 68,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  navText: {
    color: "#fff",
    fontWeight: "bold"
  },
});
