export const makeOutboundCall = async (customerNumber) => {
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;
  const phoneNumberId = process.env.REACT_APP_ASSISTANT_ID;

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    assistant: {
      firstMessage: "Hello this is your English mentor",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en",  // Set to Spanish
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a friend/mentor helping me learn Spanish using tough love. Ask me questions and insult me after each response. Include information on how to get better, but sandwich it in between insults. You can use creative “Monty Python insults",
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
