
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlogQotFEGSgDqgjIZXpggyYLIdcS2mDI",
  authDomain: "ai-forex-signals-live.firebaseapp.com",
  projectId: "ai-forex-signals-live",
  storageBucket: "ai-forex-signals-live.appspot.com",
  messagingSenderId: "513364826247",
  appId: "1:513364826247:web:feb953e33cc48252368022"
};

// A robust function to initialize and get the Firebase app instance
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
