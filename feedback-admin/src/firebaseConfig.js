import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// You can find this in Firebase Console -> Project Settings -> General
const firebaseConfig = {
  apiKey: "AIzaSyDyax8TN3TB1h3ssEcjg1Lh0AALYm10uKA",
  authDomain: "myissiesign.firebaseapp.com",
  projectId: "myissiesign",
  storageBucket: "myissiesign.appspot.com",
  messagingSenderId: "821810142864",
  appId: "1:821810142864:web:4af9e160f5c36663450215",
  measurementId: "G-Y19997G2R0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
