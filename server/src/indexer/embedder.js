import { pipeline } from "@xenova/transformers";

let extractor = null;

async function getExtractor() {
  if (!extractor) {
    console.time("Model Load");

    extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    console.timeEnd("Model Load");
  }

  return extractor;
}

export async function generateEmbedding(text) {
  console.time("Single Embedding");

  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  console.timeEnd("Single Embedding");

  return Array.from(output.data);
}