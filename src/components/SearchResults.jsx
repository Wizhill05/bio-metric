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
        <div className="paper-viewer">
          {/* Left Sidebar (List of Papers) */}
          <div className="paper-sidebar">
            {papers.map((paper, idx) => (
              <div 
                key={idx} 
                className={`paper-tab ${idx === selectedPaperIdx ? 'active' : ''}`}
                onClick={() => setSelectedPaperIdx(idx)}
              >
                {paper.title}
              </div>
            ))}
          </div>
          
          {/* Right Pane (Document Detail) */}
          <div className="paper-preview">
            <div className="preview-title">{selectedPaper.title}</div>
            <div className="preview-meta">
              <span>{selectedPaper.authors}</span>
              <span className="year">{selectedPaper.year}</span>
            </div>
            
            <div className="preview-abstract">
              {selectedPaper.abstract || "Abstract not available."}
            </div>

            <div className="preview-quote-label">Exact Match Retrieved</div>
            <div className="preview-quote">
              "{selectedPaper.exact_phrase}"
            </div>
            
            <div className="preview-actions">
              <a 
                href={selectedPaper.link || `https://scholar.google.com/scholar?q=${encodeURIComponent(selectedPaper.title)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="doc-link"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Verify on Google Scholar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
