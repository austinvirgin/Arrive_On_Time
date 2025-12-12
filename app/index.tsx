import { Appointment } from '@/components/appointment';
import { NotificationService } from '@/components/NotificationService';
import { useAppointmentContext } from '@/context/AppointmentContext';
import { useRouter, Stack } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GetDirections } from "../backend/navigateThere";

/*
  Index screen (My Appointments)
  - Shows a scrollable list of appointment "cards"
  - Tapping a card opens the Create/Edit screen for that appointment
  - A separate "Navigate There" button opens external directions
  - Floating + button opens the Create screen to add a new appointment
  - Styling improved to look clean and professional; functionality unchanged
*/

export default function Index() {
  const router = useRouter();
  const { appointments } = useAppointmentContext();
  const ns = new NotificationService();

  return (
    <>
      {/* Set the header title for the stack */}
      <Stack.Screen options={{ title: "My Appointments" }} />

      <View style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* Small header / hint text */}
          <Text style={styles.hintText}>Known Appointments</Text>

          {/* Appointment list: each entry is a row with the card + a Navigate button */}
          {appointments.map((item: Appointment, index: number) => (
            <View style={styles.itemWrap} key={index}>
              <View style={styles.rowContainer}>

                {/* Main tappable appointment card (opens create/edit screen) */}
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => {
                    router.push({
                      pathname: "/create",
                      params: { app_num: index }
                    });
                  }}
                >
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardSubtitle}>@ {item.address}</Text>
                  </View>

                  <View style={styles.cardRight}>
                    <Text style={styles.cardTime}>{item.time}</Text>
                    <Text style={styles.cardTransit}>{item.transit_time}</Text>
                  </View>
                </TouchableOpacity>

                {/* Blue "Navigate There" button that triggers external navigation */}
                <TouchableOpacity
                  style={styles.navButton}
                  onPress={() => GetDirections(`${item.address} rexburg`, item.transport_type)}
                >
                  <Text style={styles.navText}>Navigate</Text>
                  <Text style={styles.navTextSmall}>There</Text>
                </TouchableOpacity>

              </View>
            </View>
          ))}

        </ScrollView>

        {/* Floating add button (opens Create screen) */}
        <TouchableOpacity
          style={styles.plusButton}
          onPress={() => router.push("/create")}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f8fb" },

  container: {
    padding: 20,
    paddingBottom: 160,
  },

  hintText: {
    color: "#6b7280",
    marginBottom: 12,
    fontSize: 13,
    fontWeight: "600",
  },

  itemWrap: {
    marginBottom: 12,
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  /* Card styling (left tappable area) */
  card: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#1f2937",
    height: 78,
    marginRight: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardLeft: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    color: "#d1d5db",
    fontSize: 13,
  },
  cardRight: {
    width: 110,
    alignItems: "flex-end",
  },
  cardTime: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  cardTransit: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 6,
  },

  /* Navigate button (now blue to match add button) */
  navButton: {
    backgroundColor: "#2563eb", // changed to match floating add button
    paddingHorizontal: 12,
    height: 78,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    minWidth: 84,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  navText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  navTextSmall: {
    color: "#fff",
    fontSize: 12,
    marginTop: -2,
  },

  /* Floating add button */
  plusButton: {
    position: "absolute",
    right: 22,
    bottom: 22,
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },

  plusText: {
    color: "#fff",
    fontSize: 36,
    lineHeight: 36,
    fontWeight: "700",
  },

  /* legacy / fallback styles (kept to avoid breaking references if used elsewhere) */
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: "#6f6f6f",
    height: 68,
    marginRight: 5,
    alignItems: 'center',
    padding: 3,
    borderRadius: 10
  },
});
