import CrawlForm from "./components/CrawlForm";
import ChatBox from "./components/ChatBox";
import { useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [crawlDone, setCrawlDone] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-10 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-5xl mx-auto flex flex-col gap-8">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Chat with Website ✨
          </h1>

          <p className="text-slate-500 mt-4 text-lg">
            Crawl any website and get AI-powered answers from its content
          </p>
        </motion.div>

        {/* Crawl Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-xl"
        >
          <CrawlForm onCrawlSuccess={() => setCrawlDone(true)} />
        </motion.div>

        {/* Chat Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl"
        >
          <ChatBox />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-400 text-sm mt-4"
        >
          Powered by RAG & Groq 🚀
        </motion.div>

      </div>
    </div>
  );
}

export default App;