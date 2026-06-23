// Sentence-aware chunker

const CHUNK_SIZE = 750;
const CHUNK_OVERLAP = 100;

export function chunkText(text) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    // If adding sentence exceeds chunk size
    if ((currentChunk + sentence).length > CHUNK_SIZE) {
      chunks.push(currentChunk.trim());

      // Overlap from previous chunk
      const overlapText = currentChunk.slice(-CHUNK_OVERLAP);

      currentChunk = overlapText + " " + sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}