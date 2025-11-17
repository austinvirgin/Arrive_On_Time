import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  expoPushToken = "";

  // Registers for push notifications and stores token
  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("myNotificationChannel", {
        name: "Default Channel",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
          throw new Error("Project ID not found");
        }

        token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: "0013c313-7b35-4a96-a2f6-aeb725affe78",
          })
        ).data;

        console.log("Expo push token:", token);
        this.expoPushToken = token;
      } catch (e) {
        console.error("Error getting push token:", e);
        token = `${e}`;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }

  // Sends a notification using the stored token
  async sendNotification(title = "Push Notification", body = "Body Text of Notification") {
    if (!this.expoPushToken) {
      console.warn("Push token not set. Call registerForPushNotificationsAsync() first.");
      return;
    }

    const message = {
      to: this.expoPushToken,
      sound: "default",
      title,
      body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        accept: "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json",
      },
      body: JSON.stringify(message),
    });

    console.log("Notification sent:", message);
  }

  //New helper function: does it all in one call
  async sendPush(title, body) {
    console.log("Preparing to send push notification...");

    // Step 1: Register and get token (if not already)
    if (!this.expoPushToken) {
      await this.registerForPushNotificationsAsync();
    }

    // Step 2: Send the notification
    await this.sendNotification(title, body);

    console.log("Push notification complete!");
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
