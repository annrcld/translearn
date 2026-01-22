import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Required for Arduino communication

const firebaseConfig = {
  apiKey: "AIzaSyBCdtuNTyRzkfK5E27br6lRui_KujhZgxM",
  authDomain: "translearnapp-b1a71.firebaseapp.com",
  projectId: "translearnapp-b1a71",
  storageBucket: "translearnapp-b1a71.firebasestorage.app",
  messagingSenderId: "59793320582",
  appId: "1:59793320582:web:a58297ccd80e49de71bf07",
  measurementId: "G-5HLYJQ5M3L",
  // Ensure this URL matches what you see in your Firebase Console
  databaseURL: "https://translearnapp-b1a71-default-rtdb.firebaseio.com/" 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database so your App.js can talk to it
export const database = getDatabase(app);