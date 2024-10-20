import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC42gXV6UdPxHmCltWiin21S9OF83Mxrik",
  authDomain: "calhacks11-1463c.firebaseapp.com",
  databaseURL: "https://calhacks11-1463c-default-rtdb.firebaseio.com",
  projectId: "calhacks11-1463c",
  storageBucket: "calhacks11-1463c.appspot.com",
  messagingSenderId: "422843759845",
  appId: "1:422843759845:web:0348fc6381647b0b5da80c",
  measurementId: "G-N5FMPBG05B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
// Import the functions you need from the SDKs you need
