import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZ1G1XWw5KmUDNniwI4WKPtlELRbE4Ai0",
  authDomain: "calhacks11-34f75.firebaseapp.com",
  projectId: "calhacks11-34f75",
  storageBucket: "calhacks11-34f75.appspot.com",
  messagingSenderId: "859796992771",
  appId: "1:859796992771:web:98157fd91b055081e3ef36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
// Import the functions you need from the SDKs you need
