import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

/* ✅ MAIN CHAT ROUTE */
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const lang = req.body.language || "English";

    const prompt = `You are Lily, a professional female customer assistant.
Respond ONLY in ${lang}.
Keep response short (max 2 lines).
Be polite and helpful.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }],
            },
          ],
          systemInstruction: {
            parts: [{ text: prompt }],
          },
        }),
      }
    );

    const data = await response.json();

    console.log("Gemini Response:", JSON.stringify(data, null, 2)); // 🔥 debug

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't respond properly.";

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ reply: "Server error" });
  }
});

/* ✅ SERVER START */
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
