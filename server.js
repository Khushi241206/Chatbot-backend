const userMessage = req.body.message;
const lang = req.body.language || "English";

const prompt = `You are Lily, a professional female assistant.
Respond ONLY in ${lang}. Maximum 2 sentences. Be warm and feminine.`;

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: prompt }] }
    }),
  }
);
app.listen(10000, () => console.log("Server running"));