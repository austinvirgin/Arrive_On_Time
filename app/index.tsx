import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Menubar from "../components/Menubar";

export default function Index() {
  return (
    <SafeAreaView style={styles.root}>
      <Menubar menuTitle="Date/Time:" />
      <View style={styles.center}>
        <Text>Edit app/index.tsx to edit this screen.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
