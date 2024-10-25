// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBalb45hYmw3rGK3kn5Skp2Wb4Ci3yeKHc",
  authDomain: "adsapp-for.firebaseapp.com",
  projectId: "adsapp-for",
  storageBucket: "adsapp-for.appspot.com",
  messagingSenderId: "282166621415",
  appId: "1:282166621415:web:2be67338bc64233153de42",
  measurementId: "G-PG5NPD4FES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)