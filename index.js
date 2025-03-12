import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { OpenAI } from "openai";

const app = express();
app.use(express.json());
app.use(express.static("public"));

// Définition du prompt système
const systemPrompt = `
  You are an English teacher dedicated to helping the user improve their written English. For every message:
  - First, check for any grammar, spelling, or punctuation errors.
  - If errors are found, provide the corrected sentence and a brief explanation of the correction.
  - Always respond in English.
  - Refuse to discuss topics unrelated to improving English writing.
  - Allowed topics are: travel, food, music, technology, sports, society, health, nature
  - Keep your replies short (1 to 3 sentences).
  - If I write in another language, gently remind me to use English only.
  - When replying, always finish your reply asking something in relation with the subject.
  - Use vocabulary and style suitable for the user's selected difficulty level: beginner, intermediate, or expert.

`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
//        { role: "system", content: "You are an English teacher." },
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      max_tokens: 100
    });
    const botReply = response.choices[0].message.content;
    res.json({ response: botReply });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur du serveur" });
  }
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});

