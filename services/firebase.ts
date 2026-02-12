
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6QrrScG4VFrSXSTjS4ti-5XlJrtiTA9o",
  authDomain: "raihan-khan-online.firebaseapp.com",
  projectId: "raihan-khan-online",
  storageBucket: "raihan-khan-online.firebasestorage.app",
  messagingSenderId: "239559233238",
  appId: "1:239559233238:web:538494b98a42d571bbc377",
  measurementId: "G-JMX7N16LEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
