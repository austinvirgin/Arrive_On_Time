// app/_layout.tsx
import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useEffect } from "react";
import { Alert, Platform } from "react-native";

// --- Notification setup (safe to keep permanently) ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // iOS banner
    shouldShowList: true,   // iOS list
  }),
});
// -----------------------------------------------------

export default function RootLayout() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return <Stack />;
}

// --- Register notification permissions ---
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    Alert.alert("Notifications only work on a physical device.");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    Alert.alert("Permission required", "Enable notifications in Settings to receive alerts.");
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}
