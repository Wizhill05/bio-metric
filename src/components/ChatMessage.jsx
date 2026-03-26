import React from 'react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="message user">
        {message.content}
      </div>
    );
  }

  // Handle explicit errors seamlessly
  if (message.error) {
    return (
      <div className="message assistant" style={{ borderColor: 'var(--danger-color)' }}>
        <p style={{ color: 'var(--danger-color)' }}>{message.error}</p>
      </div>
    );
  }

  const { parsedData, raw } = message;

  return (
    <div className="message assistant">
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Left Panel: Answer Generation */}
        <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="assistant-answer">
            {parsedData?.answer || raw}
          </div>
          <div className="disclaimer" style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <strong>Disclaimer:</strong> This AI strictly retrieves and synthesizes information from referenced research. It is designed for educational and informational purposes, and is absolutely not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified physician.
          </div>
        </div>

        {/* Right Panel: Cited Sources & Links */}
        {parsedData?.papers && parsedData.papers.length > 0 && (
          <div style={{ flex: '1 1 450px', background: 'rgba(0,0,0,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Cited Sources & Evidence
            </h4>
            <div className="papers-container">
              {parsedData.papers.map((paper, idx) => {
                const searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`;
                
                return (
                  <div key={idx} className="paper-card">
                    <div className="paper-meta">
                      <span>{paper.authors}</span> <span style={{color: 'var(--accent-color)', fontWeight: 500}}>({paper.year})</span>
                    </div>
                    <div className="paper-title">
                      {paper.title}
                    </div>
                    <div className="paper-quote">
                      "{paper.exact_phrase}"
                    </div>
                    
                    <a 
                      href={searchUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '8px',
                        fontSize: '0.9rem',
                        color: 'var(--accent-color)',
                        textDecoration: 'none',
                        fontWeight: '600',
                      }}
                      onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Read full paper on Google Scholar
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
