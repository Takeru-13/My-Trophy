// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbZ4GhU5pGuY90oh5amEkRYTXWJ67GAqQ",
  authDomain: "my-trophy-9d19c.firebaseapp.com",
  projectId: "my-trophy-9d19c",
  storageBucket: "my-trophy-9d19c.firebasestorage.app",
  messagingSenderId: "741335920295",
  appId: "1:741335920295:web:eaa15cea3af66a7491f582",
  measurementId: "G-3FLR4CF2KW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

export { db , auth };
