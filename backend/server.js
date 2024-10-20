const { GoogleGenerativeAI } = require("@google/generative-ai");

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

//middleware
const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/api/generate", async (req, res) => {
  const prompt = `
    You are an AI assistant helping a user learn a new language. Below is a transcript of a conversation between the user and the AI. Analyze the conversation and provide feedback on the user's progress in learning the language. Your feedback should include two sections: 
    1. "strongPoints" – highlight the areas where the user is performing well in their language learning.
    2. "progressPoints" – suggest specific areas where the user can improve or focus to make further progress in learning the language.

    Format your response in JSON, like this:
    {
      "response": {
        "strongPoints": [/* list of strong points */],
        "progressPoints": [/* list of areas for improvement */]
      }
    }
    `;

  try {
    const { transcript } = req.body;
    const result = await model.generateContent([prompt, transcript]);
    if (result && result.response && result.response.text) {
      res.send(result.response.text());
    } else {
      res.send("Result format doesn't match expected structure.");
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
