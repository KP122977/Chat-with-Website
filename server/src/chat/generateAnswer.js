// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from "dotenv";

// dotenv.config();

// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY
// );
// console.log(
//   "Gemini Key Loaded:",
//   process.env.GEMINI_API_KEY
//     ? "YES"
//     : "NO"
// );

// export async function generateAnswer(
//   question,
//   retrievedChunks
// ) {
//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash",
//     });

//     const context = retrievedChunks
//       .map((chunk) => chunk.text)
//       .join("\n\n");

//     const prompt = `
// Answer using ONLY the context below.

// Context:
// ${context}

// Question:
// ${question}
// `;

//     const result =
//       await model.generateContent(prompt);

//     return result.response.text();
//  } catch (error) {
//   console.error("Gemini Error:", error.message);

//   const summary = retrievedChunks
//     .slice(0, 3)
//     .map(chunk => chunk.text)
//     .join("\n\n");

//   return `AI generation is currently unavailable because Gemini API quota has been exceeded.

// Retrieved relevant website content:

// ${summary}`;
// }
// }
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("Groq Key Loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

export async function generateAnswer(question, retrievedChunks) {
  try {
    const context = retrievedChunks
      .map((chunk, i) => `[Source ${i + 1}]: ${chunk.text}`)
      .join("\n\n");

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that answers questions based ONLY on the provided website content.

Rules:
- Answer using ONLY the context provided
- If the context does not contain enough information, say "I couldn't find information about that on this website."
- Be concise and clear
- Do NOT make up or assume any information`,
        },
        {
          role: "user",
          content: `Context from website:
${context}

Question: ${question}

Answer:`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || "No answer generated.";

  } catch (error) {
    console.error("❌ Groq Error:", error.message);

    const isQuota =
      error.message?.includes("quota") ||
      error.message?.includes("429") ||
      error.message?.includes("rate_limit");

    if (isQuota) {
      return "I'm currently unable to generate an answer because the AI quota has been exceeded. Please wait a moment and try again.";
    }

    return "Something went wrong while generating an answer. Please try again.";
  }
}