import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserButton, useUser } from "@clerk/clerk-react";
import { doc, getDoc } from "firebase/firestore"; // Firebase Firestore imports
import { firestore } from "./firebase"; // Import your Firestore config
import UserProgress from "./Components/UserProgress"; // Import UserProgress component
import Navbar from "./Components/NavBar";

// Fetch user transcripts from Firestore
async function fetchTranscripts(userid) {
  if (!userid) return null;
  const userDocRef = doc(firestore, `users/${userid}`);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
    let transcriptHistory = "";

    if (userData && userData.transcripts) {
      for (let i = 0; i < userData.transcripts.length; i++) {
        transcriptHistory += `This is Session ${
          i + 1
        }: transcript of the User Learning: `;
        transcriptHistory += userData.transcripts[i].transcript + "\n";
      }
      return transcriptHistory;
    }
  } else {
    console.log("User data does not exist");
    return null;
  }
}

function Progress() {
  const { isSignedIn, user } = useUser();
  const [userTranscripts, setUserTranscripts] = useState(""); // Transcripts fetched from Firestore
  const [feedback, setFeedback] = useState(null); // Feedback from the API
  const [loading, setLoading] = useState(false); // Loading state for API
  const [error, setError] = useState(null); // Error state
  const [userid, setUserid] = useState(""); // User ID from Clerk

  // Set the user ID when the user is signed in
  useEffect(() => {
    if (isSignedIn && user && user.primaryPhoneNumber) {
      const phoneNumber = user.primaryPhoneNumber.phoneNumber;
      setUserid(phoneNumber);
    }
  }, [isSignedIn, user]); // Only run this when `isSignedIn` or `user` changes

  // Fetch transcripts when the userid changes
  useEffect(() => {
    const fetchUserTranscripts = async () => {
      if (userid) {
        setLoading(true);
        try {
          const transcripts = await fetchTranscripts(userid);
          setUserTranscripts(transcripts || "No transcripts available.");

          // Automatically make the API call to get feedback
          const response = await axios.post(
            "http://localhost:5000/api/generate",
            {
              transcript: transcripts,
            }
          );
          console.log(response.data.response);
          // Assuming the API returns the expected feedback response
          setFeedback(response.data.response);
        } catch (error) {
          setError("Failed to fetch transcripts or feedback.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserTranscripts();
  }, [userid]); // Only run this when `userid` changes

  if (!isSignedIn) {
    return <p>Please sign in to view your progress.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      {/* Clerk UserButton at the top */}
      <div className="w-full flex justify-end p-4">
        <UserButton />
      </div>

      <div className="mt-8">
        {loading && <p>Loading transcripts and feedback...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display the feedback once it's available */}
        {!loading && feedback && <UserProgress feedback={feedback} />}
      </div>
    </div>
  );
}

export default Progress;
