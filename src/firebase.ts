import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAGegLXhFwuRoST2gaUgR6Y8sGW2nzdcJo",
  authDomain: "vietdesign-web.firebaseapp.com",
  projectId: "vietdesign-web",
  storageBucket: "vietdesign-web.firebasestorage.app",
  messagingSenderId: "856053676818",
  appId: "1:856053676818:web:aa4c82b645c2998ed311cb",
  measurementId: "G-3809WQ7XW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
