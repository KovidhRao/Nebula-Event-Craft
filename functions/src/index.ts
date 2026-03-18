import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// ✅ 1. Trigger when a new event is created
exports.sendNewEventNotification = functions.firestore
  .document("events/{eventId}")
  .onCreate(async (snap, context) => {
    const event = snap.data();
    const usersSnap = await db.collection("users").get();

    const batch = db.batch();
    usersSnap.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.role !== "admin") {
        const notifRef = db.collection("notifications").doc();
        batch.set(notifRef, {
          userId: userDoc.id,
          title: "🎉 New Event Added!",
          message: `A new event "${event.title}" is now open for registration.`,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          read: false,
        });
      }
    });

    await batch.commit();
    console.log("✅ Notifications sent to all users for new event:", event.title);
  });

// ✅ 2. Daily reminder for upcoming events
exports.sendEventReminder = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const eventsSnap = await db.collection("events").get();
    const eventsTomorrow = eventsSnap.docs.filter((doc) => {
      const e = doc.data();
      return e.date?.startsWith(tomorrowStr);
    });

    if (eventsTomorrow.length === 0) return null;

    for (const eventDoc of eventsTomorrow) {
      const event = eventDoc.data();
      const registrationsSnap = await db
        .collection("registrations")
        .where("eventId", "==", eventDoc.id)
        .get();

      const batch = db.batch();
      registrationsSnap.forEach((regDoc) => {
        const notifRef = db.collection("notifications").doc();
        batch.set(notifRef, {
          userId: regDoc.data().userId,
          title: "⏰ Event Tomorrow!",
          message: `Reminder: "${event.title}" starts tomorrow at ${event.time || ""}.`,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          read: false,
        });
      });
      await batch.commit();
    }

    console.log("✅ Sent event reminders for:", eventsTomorrow.length, "events");
    return null;
  });
