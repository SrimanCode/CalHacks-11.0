export const makeOutboundCall = async (customerNumber) => {
  const authToken = "YOUR_AUTH_TOKEN";
  const phoneNumberId = "PHONE_NUMBER_ID_FROM_DASHBOARD";

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const data = {
    assistant: {
      firstMessage: "Hey, what's up?",
      model: {
        provider: "openai",
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an assistant.",
          },
        ],
      },
      voice: "jennifer-playht",
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
