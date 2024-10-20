import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Avatar,
} from "@mui/material";
import Navbar from "./Components/NavBar";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { useUser } from "@clerk/clerk-react";

function History() {
  const { isSignedIn, user } = useUser();
  const [callHistory, setCallHistory] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user's call history from Firestore
  useEffect(() => {
    if (user && user.primaryPhoneNumber) {
      const phoneNumber = user.primaryPhoneNumber.phoneNumber;
      const userDocRef = doc(firestore, `users/${phoneNumber}`);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setCallHistory(data.transcripts || []);
          } else {
            console.log("No call history found for this user.");
          }
        })
        .catch((error) => {
          console.error("Error fetching call history:", error);
          setError("Unable to fetch call history.");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleDateClick = (call) => {
    setSelectedCall(call);
  };

  const renderTranscript = (transcript) => {
    const messages = transcript.split("\n");
    return (
      <Box sx={{ maxHeight: "400px", overflowY: "auto", p: 2 }}>
        {messages.map((message, index) => {
          const isUserMessage = message.startsWith("User:");
          const formattedMessage = message
            .replace("User:", "")
            .replace("AI:", "");

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: isUserMessage ? "flex-end" : "flex-start",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  maxWidth: "70%",
                  p: 2,
                  backgroundColor: isUserMessage ? "#cce4ff" : "#f1f1f1",
                  borderRadius: "12px",
                  boxShadow: 2,
                }}
              >
                <Typography variant="body1">{formattedMessage}</Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ height: "100vh", backgroundColor: "#f5f5f5", pt: 8 }}>
      {/* Added pt: 8 for padding-top */}
      <Navbar />
      <Grid container sx={{ height: "calc(100% - 64px)" }}>
        {" "}
        {/* Subtracting navbar height */}
        {/* Left side: Call History */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            backgroundColor: "#fff",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Call History
            </Typography>
            <Divider />
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : callHistory.length === 0 ? (
              <Typography>No call history available.</Typography>
            ) : (
              <List>
                {callHistory.map((call, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleDateClick(call)}
                    sx={{
                      mb: 1,
                      p: 2,
                      backgroundColor:
                        selectedCall === call ? "#e0f7fa" : "#fff",
                      borderRadius: "8px",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#e0f7fa",
                      },
                    }}
                  >
                    <Typography variant="body1">
                      {new Date(call.timestamp).toLocaleString()}{" "}
                      {/* Display formatted date */}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </Grid>
        {/* Right side: Transcript and Summary */}
        <Grid item xs={12} md={8} sx={{ p: 4 }}>
          {selectedCall ? (
            <Card sx={{ boxShadow: 3, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Call on {new Date(selectedCall.timestamp).toLocaleString()}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Summary:
                  </Typography>
                  <Typography variant="body1">
                    {selectedCall.summary}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Transcript:
                  </Typography>
                  {/* Render the transcript in a scrollable view */}
                  {renderTranscript(selectedCall.transcript)}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Select a date to view call details.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default History;
