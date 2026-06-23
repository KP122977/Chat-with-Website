# Chat With Website

A Retrieval-Augmented Generation (RAG) application that crawls a website, indexes its content, and allows users to ask questions grounded in the crawled data.

---

## Features

* Website crawling and content extraction
* Same-domain crawling with depth and page limits
* robots.txt support
* Rate-limited crawling
* Boilerplate removal (navigation, footer, banners, ads)
* Text chunking
* Local embedding generation using Transformers.js
* In-memory vector search
* Semantic retrieval using cosine similarity
* Similarity threshold for grounded responses
* Gemini-powered answer generation
* Source attribution for every answer
* Modern React + Tailwind UI

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* Cheerio
* Axios
* Transformers.js
* Google Gemini API

### Retrieval Layer

* Local embeddings using:

  * Xenova/all-MiniLM-L6-v2
* In-memory vector store
* Cosine similarity search

---

## Architecture

User URL
↓
Crawler
↓
Content Extraction
↓
Chunking
↓
Embedding Generation
↓
Vector Store
↓
Retriever
↓
Gemini
↓
Answer + Sources

---

## Crawling Strategy

The crawler follows a breadth-first crawling approach while staying within the provided domain.

### Implemented Protections

* Same-domain restriction
* Maximum page limit
* Maximum crawl depth
* robots.txt compliance
* Request rate limiting
* Non-HTML file filtering

### Content Cleaning

Before indexing, common boilerplate content is removed:

* Navigation bars
* Headers
* Footers
* Cookie banners
* Advertisements
* Sidebars
* Scripts and styles

This improves retrieval quality by reducing noise in the index.

---

## Chunking Strategy

Extracted page text is divided into smaller chunks before embedding generation.

Benefits:

* Better retrieval precision
* Reduced context size
* Improved semantic matching
* Lower memory usage

---

## Retrieval Strategy

### Embeddings

Embeddings are generated locally using:

Xenova/all-MiniLM-L6-v2

### Search

For each user query:

1. Query embedding is generated.
2. Cosine similarity is calculated against all indexed chunks.
3. Top-K most relevant chunks are retrieved.
4. Retrieved chunks are used as context for answer generation.

### Similarity Threshold

A similarity threshold is applied before answer generation.

If no sufficiently relevant chunks are found, the system returns:

"I couldn't find information about that on this website."

This prevents hallucinations and keeps answers grounded.

---

## Grounding & Hallucination Prevention

Answers are generated only from retrieved website content.

When the crawled website does not contain information relevant to the question:

* No answer is fabricated.
* The user is informed that the information was not found.

Every answer includes source links to the pages used during retrieval.

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

GEMINI_API_KEY=your_api_key

MAX_PAGES=50

MAX_DEPTH=3

RATE_LIMIT_RPS=1
```

---

## Installation

### Backend

```bash
cd server

npm install

npm run dev
```

### Frontend

```bash
cd client

npm install

npm run dev
```

---

## Usage

1. Enter a website URL.
2. Crawl and index the website.
3. Ask questions related to the crawled content.
4. Receive grounded answers with source citations.

---

## Example Questions

### Quotes Website

https://quotes.toscrape.com

Examples:

* Who are some quoted authors?
* What quotes are related to friendship?
* What are the most common tags?
* Which quotes are attributed to Albert Einstein?

### Books Website

https://books.toscrape.com

Examples:

* What book categories are available?
* What science fiction books exist?
* Which books have a five-star rating?

---

## Known Limitations

* In-memory vector store (data resets when server restarts)
* No persistent database
* Retrieval quality may decrease on extremely large websites
* JavaScript-rendered websites are not fully supported
* Gemini API quota limitations may affect answer generation

---

## Future Improvements

* Persistent vector database (pgvector, Pinecone, ChromaDB)
* Streaming responses
* JavaScript page rendering with Playwright
* Retrieval evaluation framework
* Multi-site indexing
* Hybrid search (keyword + vector retrieval)

---

## Repository Structure

server/
├── crawler/
├── indexer/
├── retriever/
├── routes/
├── chat/
└── index.js

client/
├── src/
│ ├── components/
│ ├── services/
│ └── App.jsx

---

## Author

Krish Patel

Full Stack Developer | AI/ML Enthusiast
