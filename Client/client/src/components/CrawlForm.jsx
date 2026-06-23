import { useState } from "react";
import api from "../services/api";

function CrawlForm({ onCrawlSuccess }) {
const [url, setUrl] = useState("");
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const handleCrawl = async () => {
  console.log("Crawl clicked");
  console.log("URL:", url);

  if (!url.trim() || loading) return;

  try {
    console.log("Sending request...");

    setLoading(true);
    setResult(null);

    const response = await api.post("/crawl", { url });

    console.log("Response:", response.data);

    setResult(response.data);

    if (onCrawlSuccess) {
      onCrawlSuccess(response.data);
    }
  } catch (error) {
    console.error("Crawl Error:", error);

    alert(
      error.response?.data?.error ||
      error.message ||
      "Failed to crawl website"
    );
  } finally {
    setLoading(false);
  }
};


return ( <div className="flex flex-col gap-5"> <div> <h2 className="text-xl font-semibold text-slate-800">
🌐 Crawl Website </h2> <p className="text-sm text-slate-500 mt-1">
Enter a website URL and create a searchable knowledge base. </p> </div>

```
  <div className="flex gap-3">
    <input
      type="text"
      placeholder="https://example.com"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleCrawl();
        }
      }}
      disabled={loading}
      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

    <button
      onClick={handleCrawl}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
    >
      {loading ? "Crawling..." : "Crawl"}
    </button>
  </div>

  {loading && (
    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
      <p className="text-sm text-blue-700">
        🔍 Crawling website...
      </p>
      <p className="text-sm text-blue-700">
        📚 Extracting content...
      </p>
      <p className="text-sm text-blue-700">
        🧠 Generating embeddings...
      </p>
    </div>
  )}

  {result && (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <h3 className="font-semibold text-green-700 mb-3">
        ✅ Crawl Successful
      </h3>

      <div className="flex gap-6 mb-4">
        <p>
          <strong>Pages:</strong>{" "}
          {result.pagesIndexed}
        </p>

        <p>
          <strong>Chunks:</strong>{" "}
          {result.chunksIndexed}
        </p>
      </div>

      {result.pages?.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">
            Pages Crawled
          </h4>

          <div className="flex flex-wrap gap-2">
            {result.pages.slice(0, 8).map((page, index) => (
              <a
                key={index}
                href={page.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1 bg-white border border-slate-200 rounded-full hover:bg-slate-50"
              >
                {page.title || page.url}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</div>


);
}

export default CrawlForm;
