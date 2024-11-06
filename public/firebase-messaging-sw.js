// public/firebase-messaging-sw.js

// Import the Firebase Messaging SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-sw.js';

// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyDdS2hba_4oJWk8zSwMtx7xz7wFBYt1_KQ",
    authDomain: "whatsapp-clone-30fe9.firebaseapp.com",
    projectId: "whatsapp-clone-30fe9",
    storageBucket: "whatsapp-clone-30fe9.appspot.com",
    messagingSenderId: "264597757126",
    appId: "1:264597757126:web:820d6a782c1fd40b354bc7",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log("Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Update to your own icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
