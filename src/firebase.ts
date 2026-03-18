// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// ⚠️ WARNING: Hardcoding keys for immediate functionality. Replace with your actual values.
const firebaseConfig = {
  apiKey: "AIzaSyAfQatl01Wg9l2Im0eXH2dueIAmtlCb_5I",
  authDomain: "eventx-e6936.firebaseapp.com",
  projectId: "eventx-e6936",
  storageBucket: "eventx-e6936.firebasestorage.app", 
  messagingSenderId: "214224014893",
  appId: "1:214224014893:web:3b2ccbaa9c9614d8b532a4",
  measurementId: "G-C1228YZX1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize individual services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


// Export them for use in your app
export { app, auth, db, storage};