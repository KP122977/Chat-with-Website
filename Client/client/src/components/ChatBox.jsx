import { useState, useEffect, useRef } from "react";
import api from "../services/api";

function ChatBox() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      const response = await api.post("/chat", {
        question: userQuestion,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
          sources: response.data.sources || [],
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Failed to get response from server.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages, loading]);

  return (
    <div className="flex flex-col gap-5 p-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          💬 Ask Questions
        </h2>

        <p className="text-slate-500 mt-1">
          Ask anything about the crawled website.
        </p>
      </div>

      {/* Chat Area */}
      <div className="h-[500px] overflow-y-auto rounded-3xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-5">

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-400">
            Ask your first question...
          </div>
        )}

        <div className="flex flex-col gap-5">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {/* USER */}
              {msg.role === "user" ? (
                <div className="max-w-[80%] bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 rounded-3xl shadow-lg">
                  {msg.content}
                </div>
              ) : (
                /* ASSISTANT */
                <div className="max-w-[80%] bg-white border border-slate-200 rounded-3xl px-5 py-4 shadow-md">

                  <p className="text-slate-700 whitespace-pre-wrap">
                    {msg.content}
                  </p>

                  {msg.sources?.length > 0 && (
                    <div className="mt-4">

                      <p className="text-xs font-semibold text-slate-500 mb-2">
                        Sources
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs hover:bg-indigo-200 transition"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>

                    </div>
                  )}

                </div>
              )}
            </div>
          ))}

          {/* Typing Animation */}
          {loading && (
            <div className="flex justify-start">

              <div className="bg-white border border-slate-200 rounded-3xl px-5 py-4 shadow-md">

                <div className="flex gap-1">

                  <span className="animate-bounce">●</span>

                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  >
                    ●
                  </span>

                  <span
                    className="animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  >
                    ●
                  </span>

                </div>

              </div>

            </div>
          )}
          <div ref={messagesEndRef}></div>

        </div>
      </div>

      {/* Input */}
      <div className="flex gap-3">

        <input
          type="text"
          placeholder="Ask a follow-up question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk();
            }
          }}
          className="flex-1 px-5 py-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none"
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className="
            px-7
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-indigo-500
            to-purple-600
            text-white
            font-medium
            shadow-lg
            hover:scale-105
            transition-all
            duration-300
            disabled:opacity-50
          "
        >
          {loading ? "..." : "Send"}
        </button>

      </div>

    </div>
  );
}

export default ChatBox;