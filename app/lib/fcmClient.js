import { getMessaging, getToken, onMessage } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

const messaging = getMessaging(firebaseApp);

// Request permission and get FCM token
export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    console.log("FCM Token:", token);
    // Store or send token to server as needed
  } catch (error) {
    console.error("Error getting token:", error);
  }
};

// Listen for messages in the foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
