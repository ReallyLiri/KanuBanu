import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyXBw1PI5zggefHxuVNqBD8rBD6A3pg9w",
  authDomain: "kanubanu-app.firebaseapp.com",
  projectId: "kanubanu-app",
  storageBucket: "kanubanu-app.firebasestorage.app",
  messagingSenderId: "864263732160",
  appId: "1:864263732160:web:aaed7380ea8ce974732625",
  measurementId: "G-2QQ7MHNT1X",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
