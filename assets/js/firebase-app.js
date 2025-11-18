// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmr6ohetgRU38w1UPf5WlviPc869MqrKE",
  authDomain: "aiml-portal.firebaseapp.com",
  projectId: "aiml-portal",
  storageBucket: "aiml-portal.firebasestorage.app",
  messagingSenderId: "976880421269",
  appId: "1:976880421269:web:33d16bf4147259032b4e9c",
  measurementId: "G-M8X3YJF1GK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);