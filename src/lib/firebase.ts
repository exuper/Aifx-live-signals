// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
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
