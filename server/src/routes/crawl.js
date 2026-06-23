import express from 'express';
import { crawlWebsite } from '../crawler/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url); // Validate URL
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const pages = await crawlWebsite(url);
    res.json({
      success: true,
      pagesCount: pages.length,
      pages: pages.map((p) => ({ url: p.url, title: p.title })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;