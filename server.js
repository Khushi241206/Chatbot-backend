import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

/* ✅ CHAT ROUTE WITH HISTORY */
app.post("/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // 🔥 Build conversation history
    const contents = [
      ...history,
      {
        role: "user",
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: contents,
        }),
      }
    );

    const data = await response.json();

    console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));

    let reply = "Sorry, I couldn't respond properly.";

    if (
      data?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    res.json({ reply });

  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ reply: "Server error" });
  }
});

/* ✅ START SERVER */
app.listen(10000, () => {
  console.log("Server running on port 10000");
});
