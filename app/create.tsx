import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Stack } from "expo-router";

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
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [arrivalPeriod, setArrivalPeriod] = useState<"AM" | "PM" | "">("");
  const [isRepeating, setIsRepeating] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysModalVisible, setDaysModalVisible] = useState(false);
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [estimatedTravelTime, setEstimatedTravelTime] = useState("");
  const [date, setDate] = useState("");
  const scrollRef = useRef<ScrollView | null>(null);

  const toggleDay = (dayId: string) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays((s) => s.filter((d) => d !== dayId));
    } else {
      setSelectedDays((s) => [...s, dayId]);
    }
  };

  const renderDayItem = ({ item }: { item: { id: string; label: string } }) => {
    const checked = selectedDays.includes(item.id);
    return (
      <Pressable
        onPress={() => toggleDay(item.id)}
        style={[styles.optionRow, checked && styles.optionRowSelected]}
      >
        <View style={[styles.checkboxSmall, checked && styles.checkboxSmallChecked]}>
          {checked && <Text style={styles.checkboxSmallTick}>✓</Text>}
        </View>
        <Text style={styles.optionLabel}>{item.label}</Text>
      </Pressable>
    );
  };

  const selectedDaysLabel =
    selectedDays.length === 0
      ? "None"
      : DAYS.filter((d) => selectedDays.includes(d.id))
          .map((d) => d.label)
          .join(", ");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 100 : 80;

  return (
    <>
      <Stack.Screen options={{ title: "Create Appointment" }} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safe}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.container}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            >
              <View style={styles.inputBox}>
                <Text style={styles.label}>Appointment Name:</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter appointment name"
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Address:</Text>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter address"
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Arrival time:</Text>
                <View style={styles.row}>
                  <TextInput
                    value={arrivalTime}
                    onChangeText={setArrivalTime}
                    placeholder="e.g. 12:15"
                    style={[styles.input, { flex: 1 }]}
                    returnKeyType="next"
                  />
                  <TouchableOpacity
                    style={styles.periodDropdown}
                    onPress={() => setPeriodModalVisible(true)}
                  >
                    <Text style={styles.dropdownText}>{arrivalPeriod || "AM/PM"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row}>
                <Pressable
                  onPress={() => {
                    setIsRepeating((p) => !p);
                    if (isRepeating) setSelectedDays([]);
                  }}
                  style={styles.radioRow}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isRepeating && styles.radioCircleChecked,
                    ]}
                  >
                    {isRepeating && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioLabel}>Repeating</Text>
                </Pressable>

                <TouchableOpacity
                  style={[styles.dropdown, !isRepeating && styles.dropdownDisabled]}
                  onPress={() => {
                    if (isRepeating) setDaysModalVisible(true);
                  }}
                  activeOpacity={isRepeating ? 0.7 : 1}
                >
                  <Text style={styles.dropdownText}>
                    {isRepeating ? selectedDaysLabel : "Off"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Estimated travel time:</Text>
                <TextInput
                  value={estimatedTravelTime}
                  onChangeText={setEstimatedTravelTime}
                  placeholder="e.g. 15 min"
                  style={styles.input}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputBox}>
                <Text style={styles.label}>Date:</Text>
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="Select date"
                  style={styles.input}
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>

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
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    padding: 20,
    paddingBottom: 200,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 16,
    borderRadius: 2,
    backgroundColor: "#fff",
  },
  label: {
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleChecked: {
    borderColor: "#2b8aef",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2b8aef",
  },
  radioLabel: {
    color: "#333",
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  dropdownDisabled: {
    backgroundColor: "#f5f5f5",
  },
  dropdownText: {
    color: "#333",
  },
  periodDropdown: {
    marginLeft: 10,
    width: 90,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: "#2b8aef",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
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
    borderRadius: 8,
    padding: 16,
    maxHeight: "70%",
  },
  modalContentSmall: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    width: 260,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionRowSelected: {
    backgroundColor: "#f0f8ff",
  },
  optionLabel: {
    fontSize: 15,
    marginLeft: 12,
    color: "#333",
  },
  checkboxSmall: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSmallChecked: {
    backgroundColor: "#2b8aef",
    borderColor: "#2b8aef",
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
    borderRadius: 6,
    backgroundColor: "#2b8aef",
    marginLeft: 8,
  },
  modalButtonSecondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  modalButtonText: {
    color: "#fff",
  },
  modalButtonTextSecondary: {
    color: "#333",
  },
});
