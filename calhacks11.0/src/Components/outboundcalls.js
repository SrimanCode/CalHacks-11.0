import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import React from "react";

// Fetch user data from Firestore
async function fetchUserData(userid) {
  const userDocRef = doc(firestore, `users/${userid}`);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
    return userData;
  } else {
    console.log("User data does not exist");
    return null;
  }
}

// Make an outbound call with previous transcripts integrated
async function makeOutboundCall(customerNumber, language, isMotivMode, userid) {
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;
  const phoneNumberId = process.env.REACT_APP_ASSISTANT_ID;
  let firstMessage;
  let languageName;
  let systemMessageContent;

  // Fetch user data (transcripts) before making the call
  const userData = await fetchUserData(userid);
  let transcriptHistory = "";

  if (userData && userData.transcripts) {
    // If transcripts exist, concatenate them into the transcriptHistory string
    for (let i = 0; i < userData.transcripts.length; i++) {
      transcriptHistory += `This is Session ${
        i + 1
      }: transcript of the User Learning: `;
      transcriptHistory += userData.transcripts[i].transcript + "\n";
    }
  } else {
    transcriptHistory = "No previous transcript data available.";
  }

  // Set the first message and system content based on the language selected
  switch (language) {
    case "es":
      languageName = "Spanish";
      firstMessage = "Hola, soy tu maestro de español";
      break;
    case "zh":
      languageName = "Mandarin";
      firstMessage = "你好，我是你的普通话老师";
      break;
    case "pt":
      languageName = "Portuguese";
      firstMessage = "Olá, sou seu professor de português";
      break;
    default:
      languageName = "their chosen language";
      firstMessage = "Hello, I am your teacher";
      systemMessageContent =
        "You are a friend/mentor helping me learn languages using tough love. Teach me vocab by mentioning words and the meaning of them in English. Include information on how to get better, but sandwich it in between insults. You can use creative 'Monty Python' insults.";
      break;
  }

  if (isMotivMode) {
    systemMessageContent = `You are a friend/mentor helping users learn ${languageName} using tough love. 
    Start with a greeting that is brash, but not rude. Provide a sentence in English and ask the user to translate it into ${languageName}. 
    If their answer is correct, acknowledge it, if incorrect, provide corrections with insults. 
    End the call after 3 questions. These are past transcripts of the user: ${transcriptHistory}`;
  } else {
    systemMessageContent = `You are a friend/mentor helping users learn ${languageName}. 
    Start with a greeting, ask the user to translate English sentences into ${languageName}. 
    Correct their answers and encourage them with positive feedback. End the call after 3 questions. These are past transcripts of the user: ${transcriptHistory}`;
  }

  console.log(systemMessageContent);

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    assistant: {
      firstMessage: firstMessage,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "multi",
      },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 1,
        messages: [
          {
            role: "system",
            content: systemMessageContent,
          },
        ],
      },
      voice: "alloy-openai",
      stopSpeakingPlan: {
        numWords: 4,
        voiceSeconds: 0.2,
        backoffSeconds: 1,
      },
    },
    phoneNumberId: phoneNumberId,
    customer: {
      number: customerNumber,
    },
  };

  try {
    const response = await fetch("https://api.vapi.ai/call/phone", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Call created successfully", result);

      await pollCallStatus(result.id);

      // Fetch transcript and summary after the call ends
      const transcriptResponse = await fetch(
        `https://api.vapi.ai/call/${result.id}`,
        {
          method: "GET",
          headers: headers,
        }
      );

      if (transcriptResponse.ok) {
        const callData = await transcriptResponse.json();
        const { transcript, summary } = callData;

        const userDocRef = doc(firestore, `users/${userid}`);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          await updateDoc(userDocRef, {
            transcripts: arrayUnion({
              transcript: transcript || "No transcript available",
              summary: summary || "No summary available",
              timestamp: new Date().toISOString(),
            }),
          });
        } else {
          await setDoc(userDocRef, {
            transcripts: [
              {
                transcript: transcript || "No transcript available",
                summary: summary || "No summary available",
                timestamp: new Date().toISOString(),
              },
            ],
          });
        }

        console.log(
          "Stored transcript and summary in Firestore for user:",
          userid
        );
      } else {
        console.log(
          "Failed to fetch transcript",
          await transcriptResponse.text()
        );
      }
    } else {
      console.log("Failed to create call", await response.text());
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Poll call status
async function pollCallStatus(callID) {
  let isCallFinished = false;
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  while (!isCallFinished) {
    try {
      const status = await fetch(`https://api.vapi.ai/call/${callID}`, {
        method: "GET",
        headers: headers,
      });

      if (status.ok) {
        const statusData = await status.json();
        console.log("status:", statusData.status);

        if (statusData.status === "ended") {
          console.log("Call finished!");
          isCallFinished = true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      } else {
        console.log("Failed to check status", await status.text());
      }
    } catch (error) {
      console.error("Error checking call status:", error);
      break;
    }
  }
}

export { makeOutboundCall };
