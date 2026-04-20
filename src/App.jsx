import React, { useState, useEffect, useCallback } from "react";
import SearchResults from "./components/SearchResults";
import FollowUpQuestions from "./components/FollowUpQuestions";
import HistorySidebar from "./components/HistorySidebar";
import AuthModal from "./components/AuthModal";
import OnboardingModal from "./components/OnboardingModal";
import BackgroundElements from "./components/BackgroundElements";
import { MicroscopeIcon } from "./components/Icons";
import { fetchHealthResearch } from "./api";
import { supabase } from "./supabaseClient";
import "./index.css";

const MAX_FOLLOWUPS = 4;

const SUGGESTED_QUESTIONS = [
  "Does aspartame cause cancer?",
  "What are the effects of microplastics on human health?",
  "How effective are GLP-1 agonists for weight loss?",
  "Does intermittent fasting increase longevity?",
  "What is the impact of sleep deprivation on the immune system?",
  "How does the ketogenic diet affect cardiovascular health?",
  "What is the relationship between the gut microbiome and depression?",
  "Are there long-term health effects of COVID-19?",
  "How does vitamin D deficiency impact bone density?",
  "What are the cognitive benefits of bilingualism in aging adults?",
];

// ── Collapsible previous-answer accordion ─────────────────────────────────
function PrevAnswerItem({ query, data, index, total }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="prev-answer-wrap">
      <button className="prev-answer-toggle" onClick={() => setOpen(o => !o)}>
        <span className="prev-answer-label">
          <span className="prev-answer-num">#{index + 1}</span> {query}
        </span>
        <span className="prev-answer-chevron">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="prev-answer-body">
          <SearchResults data={data} />
        </div>
      )}
    </div>
  );
}

function App() {
  // Auth
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeHistoryId, setActiveHistoryId] = useState(null);

  // Search
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState("idle");
  const [currentData, setCurrentData] = useState(null);
  const [currentQuery, setCurrentQuery] = useState("");
  // Stack of { query, data } — grows up to MAX_FOLLOWUPS entries
  const [answerStack, setAnswerStack] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ── Dark mode ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ── Suggested questions ────────────────────────────────────────────────
  useEffect(() => {
    const shuffled = [...SUGGESTED_QUESTIONS].sort(() => 0.5 - Math.random());
    setSuggestedQuestions(shuffled.slice(0, 3));
  }, []);

  // ── Supabase auth ──────────────────────────────────────────────────────
  const loadHistory = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("chat_history")
      .select("id, query, result, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (!error) setChatHistory(data || []);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setAuthLoading(false);
      if (!localStorage.getItem("onboarding-complete")) setShowOnboarding(true);
      if (u) {
        loadHistory(u.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          setShowAuthModal(false); // Close auth modal on successful login
          loadHistory(u.id);
        } else {
          setChatHistory([]);
          setSearchState("idle");
          setCurrentData(null);
          setAnswerStack([]);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [loadHistory]);

  const handleSearch = async (e, overrideQuery = null) => {
    if (e) e.preventDefault();
    const q = overrideQuery ?? query;
    if (!q.trim()) return;

    setQuery(q);
    setCurrentQuery(q);
    setSearchState("loading");
    setErrorMsg("");

    // Calculate the history payload to send to the backend
    const currentHistoryPayload = [...answerStack];
    if (currentData) {
      currentHistoryPayload.push({ query: currentQuery, data: currentData });
    }
    
    // Format history for backend
    const backendHistoryPayload = currentHistoryPayload.flatMap(item => [
      { role: "user", content: item.query },
      { role: "assistant", content: item.data.answer }
    ]);

    // Push the current answer onto the stack before loading the next one
    if (currentData) {
      setAnswerStack(prev => [...prev.slice(-(MAX_FOLLOWUPS - 1)), { query: currentQuery, data: currentData }]);
    }
    setCurrentData(null);
    // Note: Do not clear activeHistoryId here so we can update the thread

    try {
      const data = await fetchHealthResearch(q, backendHistoryPayload);
      setCurrentData(data);
      setSearchState("results");

      // Persist to Supabase
      if (user) {
        if (activeHistoryId) {
          // Follow-up: Update existing thread
          const threadItem = { query: q, data: data };
          const fullThread = [...currentHistoryPayload, threadItem];
          
          const { data: updated } = await supabase
            .from("chat_history")
            .update({ result: fullThread })
            .eq("id", activeHistoryId)
            .select()
            .single();

          if (updated) {
            setChatHistory(prev => prev.map(h => h.id === activeHistoryId ? updated : h));
          }
        } else {
          // New Search
          const initialThread = [{ query: q, data: data }];
          const { data: inserted } = await supabase
            .from("chat_history")
            .insert({ user_id: user.id, query: q, result: initialThread })
            .select()
            .single();
            
          if (inserted) {
            setChatHistory(prev => [inserted, ...prev]);
            setActiveHistoryId(inserted.id);
          }
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
      setSearchState("idle");
    }
  };

  const handleHistorySelect = (item) => {
    const thread = Array.isArray(item.result) ? item.result : [{ query: item.query, data: item.result }];
    const lastItem = thread[thread.length - 1];
    const prevStack = thread.slice(0, -1);

    setQuery(lastItem.query);
    setCurrentQuery(lastItem.query);
    setCurrentData(lastItem.data);
    setAnswerStack(prevStack);
    setSearchState("results");
    setActiveHistoryId(item.id);
    setErrorMsg("");
  };

  const handleDeleteHistory = async (id) => {
    await supabase.from("chat_history").delete().eq("id", id);
    setChatHistory(prev => prev.filter(h => h.id !== id));
    if (activeHistoryId === id) {
      setActiveHistoryId(null);
      setSearchState("idle");
      setCurrentData(null);
      setAnswerStack([]);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    await supabase.auth.signOut();
    setUser(null);
    setSearchState("idle");
    setCurrentData(null);
    setAnswerStack([]);
    setChatHistory([]);
    setActiveHistoryId(null);
  };

  const handleFollowUpSearch = (q) => {
    handleSearch(null, q);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewSearch = () => {
    setQuery("");
    setCurrentQuery("");
    setCurrentData(null);
    setAnswerStack([]);
    setSearchState("idle");
    setActiveHistoryId(null);
    setErrorMsg("");
  };

  // How many follow-ups have happened (stack length = number of follow-ups asked)
  const followUpCount = answerStack.length;
  const isFollowUp = currentData != null || followUpCount > 0;
  const maxReached = followUpCount >= MAX_FOLLOWUPS;

  // ── Render ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-logo"><MicroscopeIcon size={40} /></div>
        <div className="loading-dots" style={{ justifyContent: "center" }}>
          <span /><span /><span />
        </div>
      </div>
    );
  }

  return (
    <>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showOnboarding && <OnboardingModal onComplete={() => setShowOnboarding(false)} />}

      <div className="layout-root">
        <HistorySidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(o => !o)}
          history={chatHistory}
          onSelectHistory={handleHistorySelect}
          onDeleteHistory={handleDeleteHistory}
          user={user}
          isDarkMode={isDarkMode}
          onToggleDark={() => setIsDarkMode(d => !d)}
          onLogout={handleLogout}
          onLoginClick={() => setShowAuthModal(true)}
          onNewSearch={handleNewSearch}
          activeHistoryId={activeHistoryId}
        />

        <div className={`app-container ${searchState}`}>
          <BackgroundElements />

          {/* Search Input Area */}
          <div className="search-wrapper">
            <div className="header">
              <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <MicroscopeIcon size={36} style={{ color: 'var(--accent-color)' }} />
                BioMetric
              </h1>
              {searchState === "idle" && (
                <p>Ground-truth scientific answers mapped from verifiable literature.</p>
              )}
            </div>

            <form className="search-bar" onSubmit={handleSearch}>
              <svg width="24" height="24" fill="none" stroke="var(--border-color)"
                strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24"
                style={{ marginLeft: "12px", marginRight: "8px" }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder={isFollowUp ? "Ask a follow-up question..." : "Search medical queries"}
                value={query}
                onChange={e => setQuery(e.target.value)}
                disabled={searchState === "loading" || maxReached}
                autoFocus
              />
              <button
                type="submit"
                className={`search-btn ${isFollowUp ? "followup-mode" : ""}`}
                disabled={searchState === "loading" || !query.trim() || maxReached}
              >
                {maxReached ? "Max reached" : isFollowUp ? "Ask Follow-up" : "Research"}
              </button>
            </form>

            {maxReached && (
              <div className="followup-limit-banner">
                Max {MAX_FOLLOWUPS} follow-ups reached. Start a new search to continue.
              </div>
            )}

            {errorMsg && (
              <div className="error-banner">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
          </div>

          {/* Homepage decorative panels */}
          <div className="homepage-elements">
            <div className="side-panel side-left">
              <h3>Suggested Questions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {suggestedQuestions.map((q, idx) => (
                  <span key={idx} className="topic-tag"
                    style={{ textAlign: "left", whiteSpace: "normal", padding: "8px 12px" }}
                    onClick={() => handleSearch(null, q)}>
                    {q}
                  </span>
                ))}
              </div>
            </div>

            <div className="side-panel side-middle">
              <h3>Search Tips</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                • Use "vs" for comparisons (e.g. Keto vs Paleo).<br /><br />
                • Include specific conditions (e.g. Type 2 Diabetes).<br /><br />
                • Ask direct questions (e.g. Does X cause Y?)
              </p>
            </div>

            <div className="side-panel side-right">
              <h3>Top Sources</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                Answers synthesized directly from verified academic databases:<br /><br />
                • PubMed &amp; NCBI<br />
                • Cochrane Library<br />• Nature &amp; Science
              </p>
            </div>
          </div>

          {/* Results */}
          {searchState !== "idle" && (
            <div className="results-wrapper">

              {/* ── Stack of previous answers (always visible, even while loading) ── */}
              {answerStack.length > 0 && (
                <div className="answer-stack">
                  {answerStack.map((item, i) => (
                    <PrevAnswerItem
                      key={i}
                      query={item.query}
                      data={item.data}
                      index={i}
                      total={answerStack.length}
                    />
                  ))}
                </div>
              )}

              {/* ── Current result or loading indicator ── */}
              {searchState === "loading" ? (
                <div className="loading-view">
                  <div className="loading-dots">
                    <span /><span /><span />
                  </div>
                  <p>Initializing CrewAI Agents... Scanning literature &amp; synthesizing.</p>
                </div>
              ) : (
                <>
                  <SearchResults data={currentData} />
                  {currentData?.answer && !maxReached && (
                    <FollowUpQuestions
                      query={currentQuery}
                      answer={currentData.answer}
                      onSearch={handleFollowUpSearch}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
