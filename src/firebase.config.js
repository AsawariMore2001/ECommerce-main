import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: "AIzaSyC7OPx93-eYFMDfQp93XHZDgL3vZ7JmuZs",
//   authDomain: "maltimart-bf751.firebaseapp.com",
//   projectId: "maltimart-bf751",
//   storageBucket: "maltimart-bf751.appspot.com",
//   messagingSenderId: "761079785532",
//   appId: "1:761079785532:web:1c910e4fbbdd90f93bfb39"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCuOR6CtB7MusujSxIYURbrUS7pL2OZS0Q",
  authDomain: "maltimart-3eeaa.firebaseapp.com",
  projectId: "maltimart-3eeaa",
  storageBucket: "maltimart-3eeaa.appspot.com",
  messagingSenderId: "1081003226474",
  appId: "1:1081003226474:web:d1795b77f06277fa092113",
  measurementId: "G-E1V7E4MG4F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db=getFirestore(app);
export const storage =getStorage(app);


export default app;
