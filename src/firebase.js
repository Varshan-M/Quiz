import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1gKvcqpb4euwu2coHUvF_GW8wLSSWzdg",
  authDomain: "quiz-8dc84.firebaseapp.com",
  projectId: "quiz-8dc84",
  storageBucket: "quiz-8dc84.appspot.com",
  messagingSenderId: "693104602665",
  appId: "1:693104602665:web:05956faf922ac701953638",
  measurementId: "G-CVGXQG43JX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
