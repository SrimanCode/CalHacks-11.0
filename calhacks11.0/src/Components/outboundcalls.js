import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase";
export const makeOutboundCall = async (
  customerNumber,
  language,
  isMotivMode,
  userid
) => {
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;
  const phoneNumberId = process.env.REACT_APP_ASSISTANT_ID;
  let result;
  let firstMessage;
  let languageName;
  let systemMessageContent;

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
      languageName = "Portugese";
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
    Provide a sentence in English and ask the user to translate it into ${languageName}. 
    If their answer is correct or has a similar meaning, tell them it is correct. 
    If they answer incorrectly, include information on how to get better 
    but sandwich it between insults. Then, ask another question. 
    You can use creative “Monty Python insults”. Speak with a slow pace. 
    End the call after 3 questions.`;
  } else {
    systemMessageContent = `You are a friend/mentor helping users learn ${languageName}. 
    Provide a sentence in English and ask the user to translate it into ${languageName}. 
    If their answer is correct or has a similar meaning, tell them it is correct. 
    If they answer incorrectly, include information on how to get better. 
    Then, ask another question. Be motivational. Speak with a slow pace. 
    End the call after 3 questions.`;
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    assistant: {
      firstMessage: firstMessage, // Use language-specific first message
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "multi",
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemMessageContent, // Use language-specific system content
          },
        ],
      },
      voice: "alloy-openai",
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

          console.log("Transcript generated successfully", transcript);
          console.log("Summary generated successfully", summary);

          // Store transcript and summary in Firestore under the user's ID
          const userDocRef = doc(firestore, "users", userid); // Firestore reference

          const docSnapshot = await getDoc(userDocRef);

          if (!docSnapshot.exists()) {
            await setDoc(userDocRef, { transcripts: [] });
          }

          if (!docSnapshot.data().transcripts) {
            await updateDoc(userDocRef, { transcripts: [] });
          }

          // Append new transcript and summary to the array
          await updateDoc(userDocRef, {
            transcripts: arrayUnion({
              timestamp: new Date().toISOString(),
              transcript: transcript,
              summary: summary,
              language: languageName,
            }),
          });

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
};

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
