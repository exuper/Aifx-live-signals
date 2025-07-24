// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: This is not a recommended practice for production.
// Credentials are hardcoded here as a last resort to fix a persistent
// environment configuration issue.
const firebaseConfig = {
  projectId: "ai-forex-signals-live",
  appId: "1:1095034676935:web:271424e469500918961a86",
  storageBucket: "ai-forex-signals-live.appspot.com",
  apiKey: "REDACTED_API_KEY",
  authDomain: "ai-forex-signals-live.firebaseapp.com",
  messagingSenderId: "1095034676935",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
