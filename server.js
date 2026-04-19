import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

/* ✅ ROUTE (req works ONLY here) */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const lang = req.body.language || "English";

    const prompt = `You are Lily, a professional assistant. 
Respond only in ${lang}. Keep it short and friendly.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }],
          systemInstruction: {
            parts: [{ text: prompt }],
          },
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
});

/* ✅ START SERVER */
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
