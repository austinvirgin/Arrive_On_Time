import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Stack } from "expo-router";

export default function CreateAppointment() {
  return (
    <>
      <Stack.Screen options={{ title: "Create Appointment" }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Appointment Name:</Text>
            <TextInput placeholder="Enter appointment name" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Address:</Text>
            <TextInput placeholder="Enter address" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Arrival time:</Text>
            <TextInput placeholder="e.g. 12:15" style={styles.input} />
          </View>

          <View style={styles.row}>
            <View style={styles.radioCircle} />
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>repeating ▾</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Estimated travel time:</Text>
            <TextInput placeholder="e.g. 15 min" style={styles.input} />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Date:</Text>
            <TextInput placeholder="Select date" style={styles.input} />
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    padding: 20,
    paddingBottom: 40
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 16,
    borderRadius: 2,
    backgroundColor: "#fff"
  },
  label: {
    marginBottom: 8,
    color: "#333"
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 10
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#333",
    marginRight: 12
  },
  dropdown: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    paddingHorizontal: 12,
    borderRadius: 4
  },
  dropdownText: {
    color: "#333"
  },
  saveButton: {
    marginTop: 18,
    backgroundColor: "#2b8aef",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center"
  },
  saveText: {
    color: "#fff",
    fontWeight: "600"
  }
});
