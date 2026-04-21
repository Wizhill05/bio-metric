import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const CitationTooltip = ({ paper, children }) => {
  if (!paper) return children;
  
  return (
    <span className="citation-wrapper">
      <span className="citation-link">{children}</span>
      <div className="citation-tooltip">
        <div className="tooltip-title">{paper.title}</div>
        <div className="tooltip-meta">{paper.authors} • <span className="year">{paper.year}</span></div>
      </div>
    </span>
  );
};

export default function SearchResults({ data }) {
  const [activeTab, setActiveTab] = useState('answer');
  const [selectedPaperIdx, setSelectedPaperIdx] = useState(0);

  if (!data) return null;

  const papers = data.papers || [];
  const selectedPaper = papers[selectedPaperIdx];

  const markdownComponents = {
    a: ({node, href, children}) => {
      if (href && href.startsWith('#paper-')) {
        const paperIndex = parseInt(href.replace('#paper-', ''), 10) - 1;
        const paper = papers[paperIndex];
        return <CitationTooltip paper={paper}>{children}</CitationTooltip>;
      }
      return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    }
  };

  return (
    <div className="search-results-container">
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'answer' ? 'active' : ''}`}
          onClick={() => setActiveTab('answer')}
        >
          Detailed Answer
        </button>
        <button 
          className={`tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('sources');
            setSelectedPaperIdx(0);
          }}
        >
          Sources & Documents ({papers.length})
        </button>
      </div>

      {activeTab === 'answer' && (
        <div className="answer-panel">
          <div className="assistant-answer markdown-body">
            <ReactMarkdown components={markdownComponents}>{data.answer}</ReactMarkdown>
          </div>
        </div>
      )}

      {activeTab === 'sources' && papers.length > 0 && (
        <div className="sources-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {papers.map((paper, idx) => {
            const isOpen = selectedPaperIdx === idx;
            return (
              <div key={idx} className="prev-answer-wrap" style={{ margin: 0 }}>
                <button 
                  className="prev-answer-toggle" 
                  onClick={() => setSelectedPaperIdx(isOpen ? -1 : idx)}
                  style={{ textTransform: 'none' }}
                >
                  <span className="prev-answer-label" style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {paper.title}
                  </span>
                  <span className="prev-answer-chevron">{isOpen ? '▲' : '▼'}</span>
                </button>
                
                {isOpen && (
                  <div className="prev-answer-body">
                    <div className="preview-meta">
                      <span>{paper.authors}</span>
                      <span className="year">{paper.year}</span>
                    </div>
                    
                    <div className="preview-abstract">
                      {paper.abstract || "Abstract not available."}
                    </div>

                    <div className="preview-quote-label">Exact Match Retrieved</div>
                    <div className="preview-quote">
                      "{paper.exact_phrase}"
                    </div>
                    
                    <div className="preview-actions">
                      <a 
                        href={paper.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(paper.title)}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="doc-link"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Verify on Google Scholar
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
