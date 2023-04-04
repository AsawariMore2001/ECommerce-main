import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore } from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC7OPx93-eYFMDfQp93XHZDgL3vZ7JmuZs",
  authDomain: "maltimart-bf751.firebaseapp.com",
  projectId: "maltimart-bf751",
  storageBucket: "maltimart-bf751.appspot.com",
  messagingSenderId: "761079785532",
  appId: "1:761079785532:web:1c910e4fbbdd90f93bfb39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
export const db=getFirestore(app);
export const storage =getStorage(app);


export default app;
