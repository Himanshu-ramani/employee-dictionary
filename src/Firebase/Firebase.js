import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC7oroslvGs3-rVs07ZHBk-mEfMMb6ppMM",
  authDomain: "employee-354ab.firebaseapp.com",
  databaseURL: "https://employee-354ab-default-rtdb.firebaseio.com",
  projectId: "employee-354ab",
  storageBucket: "employee-354ab.appspot.com",
  messagingSenderId: "479551017291",
  appId: "1:479551017291:web:26a96409d00de952c258ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
export { storage, app, db, auth };
