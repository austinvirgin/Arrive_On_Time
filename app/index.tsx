import React from "react";
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.listSpace}>
          <Text style={styles.hintText}>Appointments will show here</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.plusButton} activeOpacity={0.8} onPress={() => router.push("/create")}>
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
