import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./components/ChatMessage";
import { fetchHealthResearch } from "./api";
import "./index.css"; // Add our premium CSS

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      parsedData: {
        answer:
          "Hello. I am the AI Health Researcher. I rigorously analyze medical queries and pull verifiable, strictly referenced exact phrases from scientific papers to answer your questions. I am now configured securely via your .env file.",
        papers: [],
      },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages
        .map((m) => {
          if (m.role === "user") return { role: "user", content: m.content };
          if (m.role === "assistant" && m.parsedData?.answer) {
            return { role: "assistant", content: m.parsedData.answer };
          }
          return null;
        })
        .filter(Boolean);

      const data = await fetchHealthResearch(query, historyPayload);
      setMessages((prev) => [...prev, { role: "assistant", parsedData: data }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", error: err.message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Health Researcher AI</h1>
        <p>Ground-truth scientific answers with exact citations</p>
      </div>

      <div className="chat-container">
        <div className="messages-list" ref={scrollRef}>
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} message={msg} />
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        <form className="input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Ask a health or medical question (e.g. Is aspartame cancer causing?)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !query.trim()}
          >
            Research
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
