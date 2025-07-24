// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlogQotFEGSgDqgjIZXpggyYLIdcS2mDI",
  authDomain: "ai-forex-signals-live.firebaseapp.com",
  projectId: "ai-forex-signals-live",
  storageBucket: "ai-forex-signals-live.firebasestorage.app",
  messagingSenderId: "513364826247",
  appId: "1:513364826247:web:81c256a41c6ceccc368022"
};

// A robust function to initialize and get the Firebase app instance
function getFirebaseApp(): FirebaseApp {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
}

const app = getFirebaseApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
