// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCg7PyWLAjH3NgW_4qA_NiasgOXhI4s33c",
  authDomain: "gainsville-8b18b.firebaseapp.com",
  projectId: "gainsville-8b18b",
  storageBucket: "gainsville-8b18b.firebasestorage.app",
  messagingSenderId: "324995731061",
  appId: "1:324995731061:web:ed300b70076624b5c0f23c",
  measurementId: "G-FFWQRYFZXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);