import { generateEmbedding } from "../indexer/embedder.js";
import { searchVectorStore } from "../indexer/vectorStore.js";
import { getStoreSize } from "../indexer/vectorStore.js";

const SIMILARITY_THRESHOLD = 0.30;

export async function retrieveRelevantChunks(question, topK = 5) {
  console.log("Store Size:", getStoreSize());

  const queryEmbedding = await generateEmbedding(question);

  const results = searchVectorStore(queryEmbedding, topK);

  if (!results.length) {
    return [];
  }

  console.log("Top Similarity Score:", results[0].score);

  if (results[0].score < SIMILARITY_THRESHOLD) {
    console.log("Low similarity detected. Rejecting answer.");
    return [];
  }

  return results;
}