// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJB4Xvn8GCE7OFSRnmqtzvLvdlrJjklwU",
  authDomain: "vivu-travel.firebaseapp.com",
  projectId: "vivu-travel",
  storageBucket: "vivu-travel.firebasestorage.app",
  messagingSenderId: "115345281120",
  appId: "1:115345281120:web:e32b4a558ccf9192a97305",
  measurementId: "G-PV9G36H2N9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


