import { chunkText } from "./chunker.js";
import { generateEmbedding } from "./embedder.js";
import {
  addToVectorStore,
  clearVectorStore,
} from "./vectorStore.js";

const BATCH_SIZE = 5;

export async function indexWebsite(pages) {
  console.time("Total Indexing");

  clearVectorStore();

  let totalChunks = 0;

  for (const page of pages) {
    console.log(`📄 Processing: ${page.title}`);

    const chunks = chunkText(page.text)
      .filter((chunk) => chunk.trim().length > 100);
    console.log(`📄 ${page.title} -> ${chunks.length} chunks`);

    console.log(`✂️ Chunks created: ${chunks.length}`);

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      const embeddings = await Promise.all(
        batch.map((chunk) => generateEmbedding(chunk))
      );

      batch.forEach((chunk, index) => {
        addToVectorStore({
          text: chunk,
          embedding: embeddings[index],
          url: page.url,
          title: page.title,
          chunkIndex: i + index,
        });

        totalChunks++;
      });
    }
  }

  console.log(`✅ Pages Indexed: ${pages.length}`);
  console.log(`✅ Chunks Indexed: ${totalChunks}`);

  console.timeEnd("Total Indexing");

  return {
    pagesIndexed: pages.length,
    chunksIndexed: totalChunks,
  };
}