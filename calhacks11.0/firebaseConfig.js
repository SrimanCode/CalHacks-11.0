// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC42gXV6UdPxHmCltWiin21S9OF83Mxrik",
  authDomain: "calhacks11-1463c.firebaseapp.com",
  databaseURL: "https://calhacks11-1463c-default-rtdb.firebaseio.com",
  projectId: "calhacks11-1463c",
  storageBucket: "calhacks11-1463c.appspot.com",
  messagingSenderId: "422843759845",
  appId: "1:422843759845:web:05d3c5b26b7f42025da80c",
  measurementId: "G-7DWC75L87W",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
