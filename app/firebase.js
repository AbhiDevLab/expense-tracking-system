// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Debug: Log configuration in development
if (process.env.NODE_ENV === "development") {
  console.log("Firebase Config:", {
    apiKey: firebaseConfig.apiKey ? "✓ Set" : "✗ Missing",
    authDomain: firebaseConfig.authDomain ? "✓ Set" : "✗ Missing",
    projectId: firebaseConfig.projectId ? "✓ Set" : "✗ Missing",
    storageBucket: firebaseConfig.storageBucket ? "✓ Set" : "✗ Missing",
    messagingSenderId: firebaseConfig.messagingSenderId ? "✓ Set" : "✗ Missing",
    appId: firebaseConfig.appId ? "✓ Set" : "✗ Missing",
  });
}

// Initialize Firebase
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);