import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB6QrrScG4VFrSXSTjS4ti-5XlJrtiTA9o",
  authDomain: "raihan-khan-online.firebaseapp.com",
  projectId: "raihan-khan-online",
  storageBucket: "raihan-khan-online.firebasestorage.app",
  messagingSenderId: "239559233238",
  appId: "1:239559233238:web:b69460ce42cb55e7bbc377",
  measurementId: "G-D08YHWGQPX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    const supported = await isSupported();
    if (supported) {
      return getAnalytics(app);
    }
  }
  return null;
};

export default app;