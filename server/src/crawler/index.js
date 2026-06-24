import axios from 'axios';
import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';
import { URL } from 'url';


const MAX_PAGES = parseInt(process.env.MAX_PAGES) || 5;
const MAX_DEPTH = parseInt(process.env.MAX_DEPTH) || 1;
const RATE_LIMIT_MS = 250;

// Sleep helper for rate limiting
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch and parse robots.txt
async function fetchRobots(baseUrl) {
  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href;
    const response = await axios.get(robotsUrl, { timeout: 5000 });
    return robotsParser(robotsUrl, response.data);
  } catch {
    return null;
  }
}

// Clean page content — strip boilerplate
function extractCleanText($) {
  // Remove boilerplate elements
  $(
    'nav, footer, header, .nav, .footer, .header, .cookie, .banner, .advertisement, .ads, .sidebar, .menu, .popup, .modal, script, style, noscript, iframe'
  ).remove();

  // Get main content — prefer semantic tags
  const mainContent =
    $('main').text() ||
    $('article').text() ||
    $('[role="main"]').text() ||
    $('body').text();

  // Clean up whitespace
  return mainContent.replace(/\s+/g, ' ').trim();
}

// Extract all valid links from a page
function extractLinks($, baseUrl, currentUrl) {
  const links = new Set();
  const base = new URL(baseUrl);

  $('a[href]').each((_, el) => {
    try {
      const href = $(el).attr('href');
      const absolute = new URL(href, currentUrl).href;
      const parsed = new URL(absolute);

      // Stay within same domain
      if (
        parsed.hostname === base.hostname &&
        parsed.protocol.startsWith('http') &&
        !absolute.includes('#') &&
        !absolute.match(/\.(pdf|jpg|jpeg|png|gif|svg|zip|csv|xlsx|docx)$/i)
      ) {
        // Normalize URL — remove trailing slash and query params
        const normalized = `${parsed.origin}${parsed.pathname}`.replace(/\/$/, '');
        if (
         normalized.includes("/privacy") ||
         normalized.includes("/terms") ||
         normalized.includes("/cookie") ||
         normalized.includes("/login") ||
         normalized.includes("/register")
       ) {
  return;
}
        links.add(normalized);
      }
    } catch {
      // Skip invalid URLs
    }
  });

  return links;
}

// Main crawl function
export async function crawlWebsite(startUrl) {
  console.log("🚀 Starting crawl for:", startUrl);
  const baseUrl = new URL(startUrl).origin;
  const robots = await fetchRobots(baseUrl);

  const visited = new Set();
  const queue = [{ url: startUrl, depth: 0 }];
  const pages = [];

  console.log(`🕷️  Starting crawl: ${startUrl}`);
  console.log(`📄 Max pages: ${MAX_PAGES} | Max depth: ${MAX_DEPTH}`);

  while (queue.length > 0 && pages.length < MAX_PAGES) {
    const { url, depth } = queue.shift();

    // Skip if already visited or too deep
    if (visited.has(url) || depth > MAX_DEPTH) continue;
    visited.add(url);

    // Respect robots.txt
    if (robots && !robots.isAllowed(url, 'ChatWithWebsiteBot')) {
      console.log(`🚫 Blocked by robots.txt: ${url}`);
      continue;
    }

    try {
      console.log(`🔍 Crawling [${pages.length + 1}/${MAX_PAGES}]: ${url}`);

      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'ChatWithWebsiteBot/1.0 (educational RAG project)',
        },
      });

      // Only process HTML pages
      const contentType = response.headers['content-type'] || '';
      if (!contentType.includes('text/html')) continue;

      const $ = cheerio.load(response.data);

      // Extract title and clean text
      const title = $('title').text().trim() || url;
      const text = extractCleanText($);

      // Skip pages with very little content
      if (text.length < 100) {
        console.log(`⏭️  Skipping (too short): ${url}`);
        continue;
      }

      pages.push({ url, title, text });

      // Extract and queue new links
      if (depth < MAX_DEPTH) {
        const links = extractLinks($, baseUrl, url);
        for (const link of links) {
          if (!visited.has(link)) {
            queue.push({ url: link, depth: depth + 1 });
          }
        }
      }

      // Rate limit — be polite!
      await sleep(RATE_LIMIT_MS);
    } catch (error) {
      console.log(`❌ Failed to crawl ${url}: ${error.message}`);
    }
  }

  console.log(`✅ Crawl complete! ${pages.length} pages indexed.`);
  return pages;
}
