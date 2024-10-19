export const makeOutboundCall = async (customerNumber) => {
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;
  const phoneNumberId = process.env.REACT_APP_ASSISTANT_ID;

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    assistant: {
      firstMessage: "Hello, this is your Spanish language mentor.",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en", // Set to Spanish
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a friend/mentor helping me learn Spanish using very aggressive tough love tactics. Ask me questions, interrupt me if I mess up, and insult me when I fail to provide a correct response to your questions. Question types include spanish verb conjugations, real-world scenario responses, and Spanish culture. Include information on how to improve, but sandwich it in between creative insults. You can use funny insults that are similar to Monty Python, and border along the line of profanity but do not use profanity whatsoever.",
          },
        ],
      },
      voice: "juan-rime-ai",
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
    } else {
      console.log("Failed to create call", await response.text());
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
