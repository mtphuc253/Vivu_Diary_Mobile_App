// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getStorage } from "firebase/storage"; // Add this to work with Firebase Storage

// // Your web app's Firebase configuration for image storage
// const imageFirebaseConfig = {
//   apiKey: "AIzaSyAScRnceu1NOip-31W-MBo-RlchBBgeGrM",
//   authDomain: "vivu-image.firebaseapp.com",
//   projectId: "vivu-image",
//   storageBucket: "vivu-image.appspot.com",
//   messagingSenderId: "765527775429",
//   appId: "1:765527775429:web:416b58168d9efef824b8ac",
//   measurementId: "G-Y1X03JFTE5"
// };

// // Initialize Firebase with a custom name
// export const imageApp = initializeApp(imageFirebaseConfig, "imageApp");
// export const storage = getStorage(imageApp); // Use this to interact with storage


import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const imageFirebaseConfig = {
  apiKey: "AIzaSyANPw33bttHrZBufglLb9uy0mS-sHgavsU",
  authDomain: "createsyllabusuploading.firebaseapp.com",
  projectId: "createsyllabusuploading",
  storageBucket: "createsyllabusuploading.appspot.com",
  messagingSenderId: "402980380426",
  appId: "1:402980380426:web:3393368ebd9d07af0ba4f3"
};

// Initialize Firebase
export const imageApp = initializeApp(imageFirebaseConfig, "imageApp");
export const storage = getStorage(imageApp); 
