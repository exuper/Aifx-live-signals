
// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "ai-forex-signals-live",
  appId: "1:513364826247:web:81c256a41c6ceccc368022",
  storageBucket: "ai-forex-signals-live.firebasestorage.app",
  apiKey: "AIzaSyBlogQotFEGSgDqgjIZXpggyYLIdcS2mDI",
  authDomain: "ai-forex-signals-live.firebaseapp.com",
  messagingSenderId: "513364826247",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
