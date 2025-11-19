import { useAppointmentContext } from "@/context/AppointmentContext";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import MaskInput from "react-native-mask-input";
import { calculateTime } from "../backend/backend";

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
    const { appointments, addAppt, removeAppt, modifyAppt } = useAppointmentContext(); // this allows persistent appointment data across screens
    const params = useLocalSearchParams();
    const appt = params.app_num; // this might be empty if app_num wasn't set by the appointment
    let app_num: number = -1;
    let repeat_days: string[] = []; // set a default blank list if this parameter doesn't exist
    if (appt && !Array.isArray(appt))
    {
        app_num = parseInt(appt, 10); // convert to integer index
        if (app_num > appointments.length)
        {
            app_num = -1
        }
    }
    if (app_num >= 0)
    {
        repeat_days = appointments[app_num].repeat ?? []; // set a default blank list if this parameter doesn't exist
  }
  const [name, setName] = app_num >= 0? useState(appointments[app_num].name) : useState("") ;
  const [address, setAddress] = app_num >= 0? useState(appointments[app_num].address) : useState("");
  const [arrivalTime, setArrivalTime] = app_num >= 0? useState(appointments[app_num].time.split(" ")[0]) : useState("");
  const [arrivalPeriod, setArrivalPeriod] = app_num >= 0? useState(appointments[app_num].time.split(" ")[1].toUpperCase()) : useState<"AM" | "PM" | "">("");
  const [isRepeating, setIsRepeating] = app_num >= 0? useState(repeat_days.length > 0) : useState(false);
  const [selectedDays, setSelectedDays] = app_num >= 0? useState<string[]>(repeat_days) : useState<string[]>([]);
  const [daysModalVisible, setDaysModalVisible] = useState(false);
  const [startingLocation, setStartingLocation] = app_num >= 0? useState(appointments[app_num].starting_address): useState("");
  const [periodModalVisible, setPeriodModalVisible] = useState(false);
  const [travelType, SetTravelType] = app_num >= 0? useState(appointments[app_num].transport_type) : useState("");
  const [travelTypeVisible, setTravelTypeVisible] = useState(false);
  const [date, setDate] = app_num >= 0? useState(appointments[app_num].date) : useState("");

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
    selectedDays.length === 0 ? "None" : DAYS.filter((d) => selectedDays.includes(d.id))
      .map((d) => d.label)
      .join(", ");

  // code to allow for the delete button to appear (requires that this is a specific index of the appointments list)
  let can_delete = null;
  if(app_num >= 0)
  {
    can_delete = (
        <TouchableOpacity style = {styles.deleteButton} onPress={() =>{
            removeAppt(app_num);
            router.replace('..'); // replace this page with the previous page, rerendered
        }}>
            <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Create Appointment" }} />
      <View style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Appointment Name:</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Enter appointment name" style={styles.input}/>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Starting Address:</Text>
            <TextInput value={startingLocation} onChangeText={setStartingLocation} placeholder="Enter starting address" style={styles.input}/>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Address:</Text>
            <TextInput value={address} onChangeText={setAddress} placeholder="Enter address" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Arrival time:</Text>
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

          <View style={styles.row}>
            <Pressable onPress={() => { setIsRepeating((p) => !p); if (isRepeating) setSelectedDays([]); }} style={styles.radioRow}>
              <View style={[styles.radioCircle, isRepeating && styles.radioCircleChecked]}>
                {isRepeating && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>Repeating</Text>
            </Pressable>

            <TouchableOpacity
              style={[styles.dropdown, !isRepeating && styles.dropdownDisabled]}
              onPress={() => { if (isRepeating) setDaysModalVisible(true); }}
              activeOpacity={isRepeating ? 0.7 : 1}
            >
              <Text style={styles.dropdownText}>{isRepeating ? selectedDaysLabel : "Off"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Date:</Text>
            <TextInput value={date} onChangeText={setDate} placeholder="Select date" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <TouchableOpacity onPress={() => setTravelTypeVisible(true)}>
              <Text style={styles.travelType}>{travelType || "Travel Type"}</Text>
            </TouchableOpacity>
          </View> 
          
          <TouchableOpacity style={styles.saveButton} onPress={async() => {
              const time = `${arrivalTime} ${arrivalPeriod}`
              const eta = await calculateTime(startingLocation, address, travelType.toLowerCase(), time)
              if (app_num >= 0)
              {
                modifyAppt(app_num, name, address, date, time, eta, travelType, startingLocation, selectedDays);
              }
              else{
                addAppt(name, address, date, time, eta, travelType, startingLocation, selectedDays); // make an appointment with this screen's data
              }
              router.replace('..'); // then go back to the main index.tsx screen
            }}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
          {can_delete}
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

        <Modal visible={travelTypeVisible} animationType="fade" transparent>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContentSmall}>
              <Text style={styles.modalTitle}>Travel Type</Text>
              <Pressable onPress={() => { SetTravelType("Walking"); setTravelTypeVisible(false); }} style={styles.optionRow}>
                <Text style={styles.optionLabel}>Walking</Text>
              </Pressable>
              <Pressable onPress={() => { SetTravelType('Driving'); setTravelTypeVisible(false); }} style={styles.optionRow}>
                <Text style={styles.optionLabel}>Driving</Text>
              </Pressable>
              <Pressable onPress={() => { SetTravelType('Biking'); setTravelTypeVisible(false); }} style={styles.optionRow}>
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
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    padding: 20,
    paddingBottom: 40,
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ddd",
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText:{
    color: "#f00",
    textDecorationLine: "underline"
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
  travelType: {
    textAlign: "center"
  },
});
