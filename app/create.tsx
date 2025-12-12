import { useAppointmentContext } from "@/context/AppointmentContext";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { calculateTime } from "../backend/backend";

/*
  CreateAppointment screen
  - Form used to create or edit an appointment
  - Keeps the same behavior you had (calculateTime on Save, edit/delete support)
  - KeyboardAvoidingView + ScrollView used so inputs are not hidden by the keyboard
  - Modals provide choices for repeating days, AM/PM, and travel type
  - Styling updated to be cleaner and friendlier; functionality unchanged
*/

const DAYS = [
  { id: "sun", label: "Sunday" },
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
  { id: "sat", label: "Saturday" },
];

export default function CreateAppointment() {
  // Context and parameters (used for editing existing appointments)
  const { appointments, addAppt, removeAppt, modifyAppt } = useAppointmentContext();
  const params = useLocalSearchParams();
  const appt = params.app_num;

  // Determine whether we're editing an existing appointment
  let app_num: number = -1;
  let repeat_days: string[] = [];
  if (appt && !Array.isArray(appt)) {
    app_num = parseInt(appt, 10);
    if (app_num > appointments.length) app_num = -1;
  }
  if (app_num >= 0) {
    repeat_days = appointments[app_num].repeat ?? [];
  }

  // Form state: pre-fill values if editing, otherwise defaults
  const [name, setName] = app_num >= 0 ? useState(appointments[app_num].name) : useState("");
  const [address, setAddress] = app_num >= 0 ? useState(appointments[app_num].address) : useState("");
  const [arrivalTime, setArrivalTime] = app_num >= 0 ? useState(appointments[app_num].time.split(" ")[0]) : useState("");
  const [arrivalPeriod, setArrivalPeriod] = app_num >= 0 ? useState(appointments[app_num].time.split(" ")[1].toUpperCase()) : useState<"AM" | "PM" | "">("");
  const [isRepeating, setIsRepeating] = app_num >= 0 ? useState(repeat_days.length > 0) : useState(false);
  const [selectedDays, setSelectedDays] = app_num >= 0 ? useState<string[]>(repeat_days) : useState<string[]>([]);
  const [extraTime, setExtraTime] = useState("5"); // extra time in minutes
  const [daysModalVisible, setDaysModalVisible] = useState(false);
  const [startingLocation, setStartingLocation] = app_num >= 0 ? useState(appointments[app_num].starting_address) : useState("");
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [travelType, SetTravelType] = app_num >= 0 ? useState(appointments[app_num].transport_type) : useState("");
  const [travelTypeVisible, setTravelTypeVisible] = useState(false);
  const [date, setDate] = app_num >= 0 ? useState(appointments[app_num].date) : useState("");

  // Optional scroll ref if you later want to auto-scroll focused inputs
  const scrollRef = useRef<ScrollView | null>(null);

  // Toggle whether a repeating day is selected
  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays((s) => s.filter((d) => d !== dayId));
    } else {
      setSelectedDays((s) => [...s, dayId]);
    }
  };

  // Renders a single day row inside the repeating-days modal
  const renderDayItem = ({ item }: { item: { id: string; label: string } }) => {
    const checked = selectedDays.includes(item.id);
    return (
      <Pressable onPress={() => toggleDay(item.id)} style={[styles.optionRow, checked && styles.optionRowSelected]}>
        <View style={[styles.checkboxSmall, checked && styles.checkboxSmallChecked]}>
          {checked && <Text style={styles.checkboxSmallTick}>✓</Text>}
        </View>
        <Text style={styles.optionLabel}>{item.label}</Text>
      </Pressable>
    );
  };

  // Human-readable label for selected days (e.g., "Mon, Wed")
  const selectedDaysLabel =
    selectedDays.length === 0 ? "None" : DAYS.filter((d) => selectedDays.includes(d.id)).map((d) => d.label).join(", ");

  // Show delete button only if editing an existing appointment
  let can_delete = null;
  if (app_num >= 0) {
    can_delete = (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          removeAppt(app_num);
          router.replace("..");
        }}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    );
  }

  // Offset for keyboard avoidance so the header doesn't overlap the scrolling area
  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : 80;

  return (
    <>
      {/* Header title for this screen */}
      <Stack.Screen options={{ title: "Create Appointment" }} />

      {/* Keyboard-aware wrapper keeps inputs visible when typing */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={keyboardVerticalOffset}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.safe}>
            <ScrollView ref={scrollRef} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">

              {/* Appointment name */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Appointment Name</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Enter appointment name" style={styles.input} returnKeyType="next" />
              </View>

              {/* Starting address */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Starting Address</Text>
                <TextInput value={startingLocation} onChangeText={setStartingLocation} placeholder="Enter starting address" style={styles.input} returnKeyType="next" />
              </View>

              {/* Destination address */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Address</Text>
                <TextInput value={address} onChangeText={setAddress} placeholder="Enter address" style={styles.input} returnKeyType="next" />
              </View>

              {/* Arrival time + AM/PM picker */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Arrival time</Text>
                <View style={styles.row}>
                  <MaskInput
                    value={arrivalTime}
                    onChangeText={setArrivalTime}
                    placeholder="e.g. 12:15"
                    style={[styles.input, { flex: 1 }]}
                    keyboardType="numeric"
                    mask={[/\d/, /\d/, ":", /\d/, /\d/]}
                  />
                  <TouchableOpacity style={styles.periodDropdown} onPress={() => setPeriodModalVisible(true)}>
                    <Text style={styles.dropdownText}>{arrivalPeriod || "AM/PM"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Extra time in minutes (e.g., arrive early) */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Extra Time (minutes)</Text>
                <View style={styles.smallInputWrap}>
                  <MaskInput value={extraTime} onChangeText={setExtraTime} keyboardType="numeric" style={styles.smallInput} />
                </View>
              </View>

              {/* Repeating toggle + days selector */}
              <View style={styles.row}>
                <Pressable
                  onPress={() => {
                    setIsRepeating((p) => !p);
                    if (isRepeating) setSelectedDays([]);
                  }}
                  style={styles.radioRow}
                >
                  <View style={[styles.radioCircle, isRepeating && styles.radioCircleChecked]}>{isRepeating && <View style={styles.radioDot} />}</View>
                  <Text style={styles.radioLabel}>Repeating</Text>
                </Pressable>

                <TouchableOpacity
                  style={[styles.dropdown, !isRepeating && styles.dropdownDisabled]}
                  onPress={() => {
                    if (isRepeating) setDaysModalVisible(true);
                  }}
                  activeOpacity={isRepeating ? 0.7 : 1}
                >
                  <Text style={styles.dropdownText}>{isRepeating ? selectedDaysLabel : "Off"}</Text>
                </TouchableOpacity>
              </View>

              {/* DATE SECTION - now has the same spacing above it as other sections */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Date</Text>
                <TextInput value={date} onChangeText={setDate} placeholder="Select date" style={styles.input} returnKeyType="done" />
              </View>

              {/* Travel type picker (modal opens on press) */}
              <View style={styles.inputBox}>
                <TouchableOpacity onPress={() => setTravelTypeVisible(true)} style={styles.travelPicker}>
                  <Text style={styles.travelTypeText}>{travelType || "Travel Type"}</Text>
                </TouchableOpacity>
              </View>

              {/* Save button: calls calculateTime then adds/modifies appointment */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={async () => {
                  const time = `${arrivalTime} ${arrivalPeriod}`;
                  console.log(arrivalPeriod);
                  const eta = await calculateTime(startingLocation, address, travelType.toLowerCase(), arrivalTime, arrivalPeriod, extraTime);
                  if (app_num >= 0) {
                    modifyAppt(app_num, name, address, date, time, eta, travelType, startingLocation, selectedDays);
                  } else {
                    addAppt(name, address, date, time, eta, travelType, startingLocation, selectedDays);
                  }
                  router.replace("..");
                }}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

              {/* Delete button shown only when editing an existing appointment */}
              {can_delete}
            </ScrollView>

            {/* Repeating days modal */}
            <Modal visible={daysModalVisible} animationType="slide" transparent>
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Repeat on</Text>
                  <FlatList data={DAYS} keyExtractor={(i) => i.id} renderItem={renderDayItem} />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => { setDaysModalVisible(false); }} style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>Done</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setSelectedDays([]); setDaysModalVisible(false); }} style={[styles.modalButton, styles.modalButtonSecondary]}>
                      <Text style={[styles.modalButtonText, styles.modalButtonTextSecondary]}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* AM/PM modal */}
            <Modal visible={periodModalVisible} animationType="fade" transparent>
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContentSmall}>
                  <Text style={styles.modalTitle}>AM / PM</Text>
                  <Pressable onPress={() => { setArrivalPeriod("AM"); setPeriodModalVisible(false); }} style={styles.optionRow}>
                    <Text style={styles.optionLabel}>AM</Text>
                  </Pressable>
                  <Pressable onPress={() => { setArrivalPeriod("PM"); setPeriodModalVisible(false); }} style={styles.optionRow}>
                    <Text style={styles.optionLabel}>PM</Text>
                  </Pressable>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setPeriodModalVisible(false)} style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            {/* Travel type modal */}
            <Modal visible={travelTypeVisible} animationType="fade" transparent>
              <View style={styles.modalBackdrop}>
                <View style={styles.modalContentSmall}>
                  <Text style={styles.modalTitle}>Travel Type</Text>
                  <Pressable onPress={() => { SetTravelType("Walking"); setTravelTypeVisible(false); }} style={styles.optionRow}>
                    <Text style={styles.optionLabel}>Walking</Text>
                  </Pressable>
                  <Pressable onPress={() => { SetTravelType("Driving"); setTravelTypeVisible(false); }} style={styles.optionRow}>
                    <Text style={styles.optionLabel}>Driving</Text>
                  </Pressable>
                  <Pressable onPress={() => { SetTravelType("Biking"); setTravelTypeVisible(false); }} style={styles.optionRow}>
                    <Text style={styles.optionLabel}>Biking</Text>
                  </Pressable>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={() => setTravelTypeVisible(false)} style={styles.modalButton}>
                      <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f8fb" },

  /* Scroll container with extra bottom padding so keyboard has room */
  container: {
    padding: 20,
    paddingBottom: 220,
  },

  /* Input card style */
  inputBox: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 2,
  },

  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#e6e9ee",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fbfdff",
  },

  /* small numeric input wrapper */
  smallInputWrap: {
    marginTop: 6,
  },
  smallInput: {
    height: 44,
    width: 120,
    borderWidth: 1,
    borderColor: "#e6e9ee",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fbfdff",
  },

  /* --- ADJUSTED: give the repeating row the same bottom spacing as other sections --- */
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  radioCircleChecked: {
    borderColor: "#2563eb",
  },

  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563eb",
  },

  radioLabel: {
    color: "#374151",
    fontWeight: "600",
  },

  dropdown: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#e6e9ee",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fbfdff",
  },

  dropdownDisabled: {
    backgroundColor: "#f3f4f6",
  },

  dropdownText: {
    color: "#111827",
  },

  periodDropdown: {
    marginLeft: 10,
    width: 96,
    height: 44,
    borderWidth: 1,
    borderColor: "#e6e9ee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#fbfdff",
  },

  saveButton: {
    marginTop: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  deleteButton: {
    marginTop: 10,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  deleteText: {
    color: "#ef4444",
    textDecorationLine: "underline",
    fontWeight: "600",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    maxHeight: "70%",
  },
  modalContentSmall: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    width: 300,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: "#111827",
    fontWeight: "700",
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionRowSelected: {
    backgroundColor: "#f1f5f9",
  },
  optionLabel: {
    fontSize: 15,
    marginLeft: 12,
    color: "#111827",
  },

  checkboxSmall: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSmallChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkboxSmallTick: {
    color: "#fff",
    fontSize: 12,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  modalButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    marginLeft: 8,
  },
  modalButtonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6e9ee",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalButtonTextSecondary: {
    color: "#111827",
  },

  travelPicker: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e6e9ee",
    backgroundColor: "#fbfdff",
  },
  travelTypeText: {
    color: "#111827",
    fontWeight: "600",
  },
});
