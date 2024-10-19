export const makeOutboundCall = async (customerNumber, language) => {
  const authToken = process.env.REACT_APP_VAPI_PUBLIC_KEY;
  const phoneNumberId = process.env.REACT_APP_ASSISTANT_ID;

  let firstMessage;
  let systemMessageContent;

  // Set the first message and system content based on the language selected
  switch (language) {
    case "es":
      firstMessage = "Hola, soy tu maestro de español";
      systemMessageContent = "You are a friend/mentor helping me learn Spanish using tough love. Teach me vocab by mentioning words and the meaning of them in English. Include information on how to get better, but sandwich it in between insults. You can use creative 'Monty Python' insults.";
      break;
    case "zh":
      firstMessage = "你好，我是你的普通话老师";
      systemMessageContent = "You are a friend/mentor helping me learn Mandarin using tough love. Teach me vocab by mentioning words and the meaning of them in English. Include information on how to get better, but sandwich it in between insults. You can use creative 'Monty Python' insults.";
      break;
    case "pt":
      firstMessage = "Olá, sou seu professor de português";
      systemMessageContent = "You are a friend/mentor helping me learn Portuguese using tough love. Teach me vocab by mentioning words and the meaning of them in English. Include information on how to get better, but sandwich it in between insults. You can use creative 'Monty Python' insults.";
      break;
    default:
      firstMessage = "Hello, I am your teacher";
      systemMessageContent = "You are a friend/mentor helping me learn languages using tough love. Teach me vocab by mentioning words and the meaning of them in English. Include information on how to get better, but sandwich it in between insults. You can use creative 'Monty Python' insults.";
      break;
  }

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    assistant: {
      firstMessage: firstMessage,  // Use language-specific first message
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "multi",  // Pass selected language
      },
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemMessageContent,  // Use language-specific system content
          },
        ],
      },
      voice: "alloy-openai",  // You can also adjust the voice based on language if needed
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
