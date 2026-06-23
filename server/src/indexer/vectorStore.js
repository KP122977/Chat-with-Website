let vectorStore = [];

// Clear old website index
export function clearVectorStore() {
  vectorStore = [];
}

// Add chunk to store
export function addToVectorStore(chunk) {
  vectorStore.push(chunk);
}

// Get all chunks
export function getAllChunks() {
  return vectorStore;
}

// Get current store size
export function getStoreSize() {
  return vectorStore.length;
}

// Cosine Similarity
function cosineSimilarity(vecA, vecB) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dot / (magA * magB);
}

// Search Top K chunks
export function searchVectorStore(queryEmbedding, topK = 5) {
  return vectorStore
    .map((item) => ({
      ...item,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}