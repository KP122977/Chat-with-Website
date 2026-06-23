import { useState } from "react";
import api from "../services/api";

function ChatBox() {
const [question, setQuestion] = useState("");
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);
const handleAsk = async () => {
  console.log("Ask button clicked");
  console.log("Question:", question);

  if (!question.trim() || loading) return;

  const userQuestion = question;

<button
  onClick={() => console.log("WORKING")}
  style={{
    background: "red",
    color: "white",
    padding: "20px",
  }}
>
  DEBUG
</button>

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userQuestion,
    },
  ]);

  setQuestion("");

  try {
    console.log("Sending chat request...");

    setLoading(true);

    const response = await api.post("/chat", {
      question: userQuestion,
    });

    console.log("Chat Response:", response.data);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources || [],
      },
    ]);
  } catch (error) {
    console.error("Chat Error:", error);

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

return ( <div className="flex flex-col gap-5"> <div> <h2 className="text-xl font-semibold text-slate-800">
💬 Ask Questions </h2> <p className="text-sm text-slate-500 mt-1">
Ask anything about the crawled website. </p> </div>

```
  <div className="border border-slate-200 rounded-xl p-4 h-[400px] overflow-y-auto bg-slate-50">
    {messages.length === 0 && (
      <div className="h-full flex items-center justify-center text-slate-400">
        Ask your first question...
      </div>
    )}

    <div className="flex flex-col gap-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${
            msg.role === "user"
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200"
            }`}
          >
            <p>{msg.content}</p>

            {msg.sources?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium mb-2">
                  Sources
                </p>

                <div className="flex flex-wrap gap-2">
                  {msg.sources.map(
                    (source, idx) => (
                      <a
                        key={idx}
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700"
                      >
                        {source.title}
                      </a>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 w-fit">
          Thinking...
        </div>
      )}
    </div>
  </div>

  <div className="flex gap-3">
    <input
      type="text"
      placeholder="Ask a question..."
      value={question}
      onChange={(e) =>
        setQuestion(e.target.value)
      }
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleAsk();
        }
      }}
      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />

    <button
      onClick={handleAsk}
      disabled={loading}
      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
    >
      {loading ? "..." : "Ask"}
    </button>
  </div>
</div>
);
}

export default ChatBox;
