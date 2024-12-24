// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-85d32.firebaseapp.com",
  projectId: "real-estate-85d32",
  storageBucket: "real-estate-85d32.firebasestorage.app",
  messagingSenderId: "476515020105",
  appId: "1:476515020105:web:bbe5150d01b4605ea4be98"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);