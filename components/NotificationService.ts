import { Appointment } from "@/components/appointment";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * --------------------------------------------------------------
 *  Expo Notification Handler
 * --------------------------------------------------------------
 * This tells Expo **how** notifications should behave when delivered.
 * These settings apply globally across the entire app.
 *
 * For Expo SDK 49+ / 50+, the fields `shouldShowBanner` and 
 * `shouldShowList` are REQUIRED on iOS.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, // iOS: show banner at the top
    shouldShowList: true,   // iOS: show in Notification Center
  }),
});

/**
 * --------------------------------------------------------------
 * NotificationService
 * --------------------------------------------------------------
 * This class manages:
 *  - Requesting permissions
 *  - Scheduling notifications
 *  - Converting Appointment objects into Date objects
 * 
 * Usage example is provided at the bottom of this file.
 */
export class NotificationService {
  expoPushToken: string = "";

  /**
   * Request notification permissions and set up Android notification channel.
   *
   * This only needs to run once before sending notifications.
   * It is automatically called inside sendPush() if needed.
   */
  async registerForPushNotificationsAsync(): Promise<string | undefined> {
    // Android requires channels for local notifications
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    // Check and request permissions
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

    // Local notifications do not require a remote push token
    this.expoPushToken = "LOCAL_ONLY_MODE";

    return this.expoPushToken;
  }

  /**
   * ----------------------------------------------------------
   * sendPush()
   * ----------------------------------------------------------
   * Schedules a **local notification** that will still fire even
   * if the app is completely closed.
   * 
   * @param title         Notification title
   * @param body          Notification body text
   * @param scheduledTime A Date, timestamp, ISO string, or null.
   *                      - If null → sends immediately
   *                      - If future date → schedules at that time
   *                      - If past date → sends immediately
   *
   * Example:
   *   ns.sendPush("Test", "Hello world", new Date(Date.now() + 60000));
   *   → sends in 1 minute
   */
  async sendPush(
    title: string,
    body: string,
    scheduledTime: string | number | Date | null = null
  ) {
    console.log("Preparing scheduled push notification...", scheduledTime);

    // Make sure permissions are handled
    if (!this.expoPushToken) {
      await this.registerForPushNotificationsAsync();
    }

    let trigger: Notifications.NotificationTriggerInput | null = null;

    // If scheduling a future notification
    if (scheduledTime) {
      // Convert to Date object
      const target =
        scheduledTime instanceof Date
          ? scheduledTime
          : new Date(scheduledTime);

      console.log("Parsed target:", target.toString());

      if (isNaN(target.getTime())) {
        console.error("❌ Invalid date passed into sendPush:", scheduledTime);
        return;
      }

      // Past → send immediately
      if (target.getTime() <= Date.now()) {
        console.warn("⚠️ Date is in the past, sending immediately.");
        trigger = null;
      } else {
        /**
         * Expo SDK 49+ requires using `type: DATE`
         * for scheduled date-based notifications.
         */
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: target,
        };
        console.log("📅 Scheduling for:", target.toString());
      }
    }

    // Schedule the actual notification
    const id = await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger,
    });

    console.log("📨 Notification scheduled. ID:", id, "Trigger:", trigger);
    return id;
  }

  /**
   * ----------------------------------------------------------
   * createDateFromAppointment()
   * ----------------------------------------------------------
   * Converts an Appointment's date + time into a valid Date obj.
   * 
   * Expected formats:
   *   appt.date = "MM-DD"
   *   appt.time = "HH:MM"
   *
   * Example:
   *   const apptDate = ns.createDateFromAppointment(appt);
   *   ns.sendPush("Reminder", "Appointment soon!", apptDate);
   */
  createDateFromAppointment(appt: Appointment): Date | null {
    try {
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

// Singleton instance used throughout the app
const notificationService = new NotificationService();
export default notificationService;


/* ================================================================
   HOW TO USE THIS SERVICE IN YOUR APP
   ================================================================
   1. Import the singleton:

       import ns from "@/services/NotificationService";

   ---------------------------------------------------------------
   2. Send a notification immediately:
   
       ns.sendPush("Hello!", "This sends right now");

   ---------------------------------------------------------------
   3. Schedule a notification 2 minutes from now:
   
       const date = new Date(Date.now() + 2 * 60 * 1000);
       ns.sendPush("Break Time!", "Take a short break", date);

   ---------------------------------------------------------------
   4. Schedule using an ISO string (recommended):
   
       ns.sendPush(
         "Meeting",
         "Standup starting soon",
         "2025-11-24T14:41:00-07:00"
       );

   ---------------------------------------------------------------
   5. Schedule from an Appointment object:

       const apptDate = ns.createDateFromAppointment(appt);

       if (apptDate) {
         ns.sendPush(
           "Appointment Reminder",
           `Upcoming: ${appt.name} at ${appt.time}`,
           apptDate
         );
       }

   ---------------------------------------------------------------
   Notes:
     - Scheduled notifications will fire even when the app is closed.
     - If a time is in the past, it sends immediately.
     - If date format is invalid, the function logs an error and does nothing.
================================================================ */
