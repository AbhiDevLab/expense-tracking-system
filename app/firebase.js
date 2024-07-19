// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-AXt_bgNfnaxKCSWoZ1uBNqrx12lGNyA",
  authDomain: "expense-tracker-7a8fc.firebaseapp.com",
  projectId: "expense-tracker-7a8fc",
  storageBucket: "expense-tracker-7a8fc.appspot.com",
  messagingSenderId: "502027219400",
  appId: "1:502027219400:web:2892e16c567c0e20e5d0fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);