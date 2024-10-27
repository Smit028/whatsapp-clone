// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    apiKey: "AIzaSyDdS2hba_4oJWk8zSwMtx7xz7wFBYt1_KQ",
    authDomain: "whatsapp-clone-30fe9.firebaseapp.com",
    projectId: "whatsapp-clone-30fe9",
    storageBucket: "whatsapp-clone-30fe9.appspot.com",
    messagingSenderId: "264597757126",
    appId: "1:264597757126:web:820d6a782c1fd40b354bc7",
    measurementId: "G-0V7LW83BZH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { firestore, auth }; // Ensure you export auth and firestore