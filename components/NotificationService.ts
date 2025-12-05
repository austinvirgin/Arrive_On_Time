import { Appointment } from "@/components/appointment";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// --- Notification handler setup ---
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});


export class NotificationService {
  expoPushToken: string = "";

  // Request permissions and setup channel
  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted for notifications");
      return;
    }

    // No remote push token needed for local notifications
    this.expoPushToken = "LOCAL_ONLY_MODE";

    return this.expoPushToken;
  }

  // Schedules a local notification
  async sendPush(
    title: string,
    body: string,
    scheduledTime: string | number | Date | null = null
  ) {
    console.log("Preparing scheduled push notification...", scheduledTime);

    // Ensure permission exists
    if (!this.expoPushToken) {
      await this.registerForPushNotificationsAsync();
    }

    let trigger: Notifications.NotificationTriggerInput | null = null;

    if (scheduledTime) {
      // Parse scheduled time
      const target =
        scheduledTime instanceof Date
          ? scheduledTime
          : new Date(scheduledTime);

      console.log("Parsed target:", target.toString());

      if (isNaN(target.getTime())) {
        console.error("❌ Invalid date format passed into sendPush:", scheduledTime);
        return;
      }

      // If date is in the past trigger immediately
      if (target.getTime() <= Date.now()) {
        console.warn("⚠️ Date is in the past, sending immediately.");
        trigger = null;
      } else {
        trigger = {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: target
       };
        console.log("📅 Scheduling for:", target.toString());
      }
    }

    // Create the notification
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger,
    });

    console.log("📨 Notification scheduled. ID:", id, "Trigger:", trigger);
  }

  //build a schedule from an Appointment instance
  createDateFromAppointment(appt: Appointment): Date | null {
    try {
      // Expecting "MM-DD" format for date and "HH:MM" for time
      const [monthStr, dayStr] = appt.date.split("-");
      const [hourStr, minuteStr] = appt.time.split(":");

      const year = new Date().getFullYear();

      const month = Number(monthStr) - 1;
      const day = Number(dayStr);
      const hour = Number(hourStr);
      const minute = Number(minuteStr);

      if (
        Number.isNaN(month) ||
        Number.isNaN(day) ||
        Number.isNaN(hour) ||
        Number.isNaN(minute)
      ) {
        console.error("Invalid Appointment date/time:", appt);
        return null;
      }

      return new Date(year, month, day, hour, minute);
    } catch (err) {
      console.error("Error parsing Appointment into Date:", err);
      return null;
    }
  }
}

// Singleton instance
const notificationService = new NotificationService();
export default notificationService;
