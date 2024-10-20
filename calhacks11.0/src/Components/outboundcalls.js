import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  collection,
} from "firebase/firestore";
import { firestore } from "../firebase";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

async function fetchUserData(userid) {
  const userDocRef = doc(firestore, `users/${userid}`);
  const docSnapshot = await getDoc(userDocRef);

  if (docSnapshot.exists()) {
    const userData = docSnapshot.data();
    return userData; // Return the entire user document (includes transcripts, summaries, etc.)
  } else {
    console.log("No data found for this user.");
    return null;
  }
}

async function sendUserDataToLLM(userid) {
  const userData = await fetchUserData(userid);

  if (!userData) {
    console.error("No data available to send to LLM");
    return;
  }

  const knowledgeBase = {
    transcripts: userData.transcripts,
    summaries: userData.summaries,
  };

  return knowledgeBase;
}

async function makeOutboundCall(customerNumber, language, isMotivMode, userid) {
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;
  const phoneNumberId = process.env.REACT_APP_ASSISTANT_ID;
  let result;
  let firstMessage;
  let languageName;
  let systemMessageContent;

  const user_data = await fetchUserData(userid);
  var res = "";

  for (let i = 0; i < user_data.transcripts.length; i++) {
    res += "This is Session " + (i + 1) + ": transcript of the User Learning: ";
    res += user_data.transcripts[i].transcript;
  }
  // Set the first message and system content based on the language selected
  switch (language) {
    case "es":
      languageName = "Spanish";
      firstMessage = "Hello, I am your spanish mentor";
      break;
    case "zh":
      languageName = "Mandarin";
      firstMessage = "Hello, I am your mandarin mentor";
      break;
    case "pt":
      languageName = "Portugese";
      firstMessage = "Hello, I am your portugese mentor";
      break;
    case "choice":
      languageName = "their chosen language";
      firstMessage =
        "Hello, I am your language mentor. What language would you like to practice?";
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
    and wait until the user responds with "Hello" to begin questions. Be mean, be harsh, and come up with creative ways to insult the user after their response, using "Monty Python" insults.. Avoid any type of 
    explicit profanity. 
    Provide a sentence in English and ask the user to translate it into ${languageName}. 
    If their answer is correct or has a similar meaning that is not the direct translation verbatim, tell them it is correct. 
    If they answer incorrectly, include information on how they can improve their answer, 
    but sandwich it between insults that are not profane. Then, ask another question. You must ask only three questions to the user. After three questions are asked, 
    you must provide a summary of the user's responses and their grammatical errors. 
    Speak with a slow pace. 
    End the call with a rude variation of the phrase "Good luck, and I will talk to you later" after three  questions. these are past transcripts of the user's prior conversations: ${res}`;
  } else {
    systemMessageContent = `You are a friend/mentor helping users learn ${languageName}. You will be having a back-and-forth conversation 
    with the user. This conversation must be a natural conversation in ${languageName}. In this conversation, you must ask the user three 
    questions. These questions should flow in conversation, and the user will respond to each one in succession. If the response does 
    not make logical sense, continue with the conversational questions as if the user responded normally. After exactly three question and answer sequences, 
    stop the conversation. Switch to speaking in English. Evaluate the user's responses strictly in English. Tell them if their answer is correct, but if their answer 
    has a similar meaning that is not the direct translation verbatim, still tell them it is correct. If they answer incorrectly, include information on how to improve their response. 
    Be motivational, cordial, and professional in your tone. Speak with a slow pace. End the call with an explicit goodbye.`;
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
      voice: {
        provider: "openai",
        voiceId: "alloy",
        speed: 0.8,
      },
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
      result = await response.json();
      console.log("Call created successfully", result);

      await pollCallStatus(result.id);

      // get a transcript and summary after the call ends
      try {
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

          //console.log("Transcript generated successfully", transcript);
          //console.log("Summary generated successfully", summary);

          // Store transcript and summary in Firestore under the user's ID
          //const userDocRef = doc(firestore, "users", userid); // Firestore reference

          const userDocRef = doc(firestore, `users/${userid}`);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            await updateDoc(userDocRef, {
              transcripts: arrayUnion({
                transcript: transcript,
                summary: summary,
                timestamp: new Date().toISOString(),
              }),
            });
          } else {
            await setDoc(userDocRef, {
              transcripts: [
                {
                  transcript: transcript,
                  summary: summary,
                  timestamp: new Date().toISOString(),
                },
              ],
            });
          }
          // Append new transcript and summary to the array

          console.log(
            "Stored transcript and summary in Firestore for user:",
            userid
          );
        } else {
          console.log(
            "Failed to create transcript",
            await transcriptResponse.text()
          );
        }
      } catch (error) {
        console.error("Error fetching transcript:", error);
      }
    } else {
      console.log("Failed to create call", await response.text());
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

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
          console.log("call finished!");
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
