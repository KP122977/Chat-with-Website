import express from 'express';
import { crawlWebsite } from '../crawler/index.js';
import { indexWebsite } from '../indexer/indexWebsite.js';
import { getStoreSize } from '../indexer/vectorStore.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({
      error: 'URL is required',
    });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      error: 'Invalid URL',
    });
  }

  try {
    const pages = await crawlWebsite(url);

    const indexResult = await indexWebsite(pages);

    console.log('Vector Store Size:', getStoreSize());

    res.json({
      success: true,
      ...indexResult,
      pages: pages.map((page) => ({
        url: page.url,
        title: page.title,
      })),
    });
  } catch (error) {
    console.error('Crawl Error:', error);

    res.status(500).json({
      error: error.message || 'Failed to crawl website',
    });
  }
});

export default router;