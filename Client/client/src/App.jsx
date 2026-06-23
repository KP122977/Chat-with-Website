import CrawlForm from "./components/CrawlForm";
import ChatBox from "./components/ChatBox";
import { useState } from "react";

function App() {
  const [crawlDone, setCrawlDone] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">🌐</span>
            <h1 className="text-3xl font-medium text-slate-800">
              Chat with Website
            </h1>
          </div>
          <p className="text-slate-500 text-sm">
            Crawl any website and ask questions powered by AI-powered RAG
          </p>
        </div>

        {/* Crawl Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-slide-up">
          <CrawlForm onCrawlSuccess={() => setCrawlDone(true)} />
        </div>

        {/* Chat Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <ChatBox />
        </div>

      </div>
    </div>
  );
}

export default App;