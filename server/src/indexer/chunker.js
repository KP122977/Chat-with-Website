const CHUNK_SIZE = 1500;
const CHUNK_OVERLAP = 150;

export function chunkText(text) {
  if (!text || !text.trim()) {
    return [];
  }

  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (
      (currentChunk + sentence).length >
      CHUNK_SIZE
    ) {
      if (currentChunk.trim().length > 200) {
        chunks.push(currentChunk.trim());
      }

      const overlapText =
        currentChunk.slice(-CHUNK_OVERLAP);

      currentChunk =
        overlapText + " " + sentence;
    } else {
      currentChunk += " " + sentence;
    }
  }

  if (currentChunk.trim().length > 200) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}