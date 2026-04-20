import React, { useState, useEffect } from 'react';
import { ChatIcon, ArrowRightIcon } from './Icons';

export default function FollowUpQuestions({ query, answer, onSearch }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query || !answer) return;
    setQuestions([]);
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

    fetch(`${API_URL}/api/followup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, answer }),
    })
      .then(r => r.json())
      .then(data => { setQuestions(data.questions || []); setLoading(false); })
      .catch(() => setLoading(false));
  // Only [answer] in deps — answer only changes when a search completes,
  // never while the user is typing, so no wasted API credits.
  }, [answer]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && questions.length === 0) return null;

  return (
    <div className="followup-container">
      <div className="followup-header">
        <ChatIcon size={14} />
        <span>You might also want to know...</span>
      </div>
      <div className="followup-cards">
        {loading
          ? [1, 2, 3].map(i => <div key={i} className="followup-skeleton" />)
          : questions.map((q, i) => (
              <button key={i} className="followup-card" onClick={() => onSearch(q)}>
                <span className="followup-arrow"><ArrowRightIcon size={14} /></span>
                <span>{q}</span>
              </button>
            ))}
      </div>
    </div>
  );
}
