// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTG_R4qmqYUCYi-_Z5FJh6PkgnaWrVnbo",
  authDomain: "menuqr-17a7d.firebaseapp.com",
  projectId: "menuqr-17a7d",
  storageBucket: "menuqr-17a7d.firebasestorage.app",
  messagingSenderId: "943215971516",
  appId: "1:943215971516:web:53915acca5f42fa66fd4b9",
  measurementId: "G-VQLBMS3116"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
