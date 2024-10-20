import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { useUser } from "@clerk/clerk-react";

// Function to fetch all user data from Firestore
