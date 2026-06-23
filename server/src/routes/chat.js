import express from "express";
import { retrieveRelevantChunks } from "../retriever/retrieveRelevantChunks.js";
import { generateAnswer } from "../chat/generateAnswer.js";

console.log("✅ Chat routes loaded");

const router = express.Router();

router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      error: "Question is required",
    });
  }

  try {
    console.log("\n==============================");
    console.log("💬 New Chat Request");
    console.log("Question:", question);

    const retrievedChunks = await retrieveRelevantChunks(question, 5);

    console.log("📚 Retrieved Chunks:", retrievedChunks.length);

    if (retrievedChunks.length > 0) {
      console.log("🔝 Top Source:", retrievedChunks[0].url);
      console.log(
        "📄 Chunk Preview:",
        retrievedChunks[0].text.substring(0, 100)
      );
    }

    if (!retrievedChunks.length) {
      return res.json({
        answer:
          "I couldn't find information about that on the crawled website.",
        sources: [],
      });
    }

    console.log("🤖 Calling Groq...");

    const answer = await generateAnswer(
      question,
      retrievedChunks
    );

    console.log("✅ Gemini Response Generated");

    const sources = [
      ...new Map(
        retrievedChunks.map((chunk) => [
          chunk.url,
          {
            title: chunk.title,
            url: chunk.url,
          },
        ])
      ).values(),
    ];

    res.json({
      answer,
      sources,
    });

  } catch (error) {
    console.error("❌ Chat Error:", error);

    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;