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
  apiKey: "AIzaSyCMLiq6f9EUYF21yC4gdFIHmBR7axdl-EY",
  authDomain: "vivu-app-595f3.firebaseapp.com",
  projectId: "vivu-app-595f3",
  storageBucket: "vivu-app-595f3.appspot.com",
  messagingSenderId: "110544938587",
  appId: "1:110544938587:web:1968ef7af026a0d9e4017e",
  measurementId: "G-EF0BCQGRRR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


