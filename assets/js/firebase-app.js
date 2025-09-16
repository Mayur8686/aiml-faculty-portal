// Import Firebase modules (using CDN for browser apps)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Paste your Firebase config here
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
const db = getFirestore(app);

// Export for use in other JS files
export { db, collection, addDoc };
