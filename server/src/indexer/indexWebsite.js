import { chunkText } from "./chunker.js";
import { generateEmbedding } from "./embedder.js";
import {
  addToVectorStore,
  clearVectorStore,
} from "./vectorStore.js";

export async function indexWebsite(pages) {
  clearVectorStore();

  let totalChunks = 0;

  for (const page of pages) {
    const chunks = chunkText(page.text);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);

      addToVectorStore({
        text: chunks[i],
        embedding,
        url: page.url,
        title: page.title,
        chunkIndex: i,
      });

      totalChunks++;
    }
  }

  return {
    pagesIndexed: pages.length,
    chunksIndexed: totalChunks,
  };
}