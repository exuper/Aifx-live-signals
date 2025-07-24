// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: This is not a recommended practice for production.
// Credentials are hardcoded here to resolve a persistent environment configuration issue.
const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "ai-forex-signals-live.firebaseapp.com",
  projectId: "ai-forex-signals-live",
  storageBucket: "ai-forex-signals-live.appspot.com",
  messagingSenderId: "1095034676935",
  appId: "1:1095034676935:web:271424e469500918961a86",
  databaseURL: "https://ai-forex-signals-live.firebaseio.com"
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
