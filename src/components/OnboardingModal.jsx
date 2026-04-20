import React, { useState } from 'react';
import {
  MicroscopeIcon, LightbulbIcon, GearIcon,
  DNAIcon, BookIcon, SearchIcon, LeafIcon,
  PersonIcon, BrainIcon, DocumentIcon,
} from './Icons';

const STEPS = [
  {
    Icon: MicroscopeIcon,
    title: 'Welcome to BioMetric',
    subtitle: 'AI-powered answers from real science',
    body: (
      <div className="onboard-body">
        <p>
          BioMetric is an AI search engine that answers medical and health questions
          by reading and synthesising <strong>real, peer-reviewed papers</strong> — not Wikipedia,
          not forums.
        </p>
        <div className="onboard-source-grid">
          <div className="onboard-source-card"><DNAIcon size={20} /><strong>PubMed &amp; NCBI</strong></div>
          <div className="onboard-source-card"><BookIcon size={20} /><strong>Cochrane Library</strong></div>
          <div className="onboard-source-card"><SearchIcon size={20} /><strong>Google Scholar</strong></div>
          <div className="onboard-source-card"><LeafIcon size={20} /><strong>Nature &amp; Science</strong></div>
        </div>
        <p className="onboard-note">Every answer cites the papers it was built from — hover citations to preview.</p>
      </div>
    ),
  },
  {
    Icon: LightbulbIcon,
    title: 'How to Get the Best Results',
    subtitle: 'Craft your queries like a researcher',
    body: (
      <div className="onboard-body">
        <div className="onboard-tips">
          <div className="onboard-tip">
            <span className="tip-num">01</span>
            <div>
              <strong>Ask direct yes/no questions</strong>
              <p>"Does aspartame cause cancer?"</p>
            </div>
          </div>
          <div className="onboard-tip">
            <span className="tip-num">02</span>
            <div>
              <strong>Use "vs" for comparisons</strong>
              <p>"Keto vs Paleo for Type 2 Diabetes"</p>
            </div>
          </div>
          <div className="onboard-tip">
            <span className="tip-num">03</span>
            <div>
              <strong>Name specific conditions</strong>
              <p>"Vitamin D deficiency and multiple sclerosis"</p>
            </div>
          </div>
          <div className="onboard-tip">
            <span className="tip-num">04</span>
            <div>
              <strong>Click follow-up suggestions</strong>
              <p>After each answer, explore related questions automatically.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: GearIcon,
    title: 'How It Works Under the Hood',
    subtitle: 'A multi-agent CrewAI pipeline',
    body: (
      <div className="onboard-body">
        <div className="onboard-pipeline">
          <div className="pipeline-node">
            <div className="pipeline-icon-box"><PersonIcon size={28} /></div>
            <div className="pipeline-node-label">Your Query</div>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-node">
            <div className="pipeline-icon-box"><SearchIcon size={28} /></div>
            <div className="pipeline-node-label">Research Agent<br /><small>Fetches real papers from Google Scholar</small></div>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-node">
            <div className="pipeline-icon-box"><BrainIcon size={28} /></div>
            <div className="pipeline-node-label">Synthesis Agent<br /><small>Builds cited answer from papers only</small></div>
          </div>
          <div className="pipeline-connector">→</div>
          <div className="pipeline-node">
            <div className="pipeline-icon-box"><DocumentIcon size={28} /></div>
            <div className="pipeline-node-label">Your Answer<br /><small>With inline citations</small></div>
          </div>
        </div>
        <p className="onboard-stack-note">Mistral LLM · CrewAI · SerpApi · Supabase</p>
      </div>
    ),
  },
];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const { Icon } = current;
  const isLast = step === STEPS.length - 1;

  const handleFinish = () => {
    localStorage.setItem('onboarding-complete', 'true');
    onComplete();
  };

  return (
    <div className="onboard-overlay">
      <div className="onboard-card">
        <div className="onboard-step-dots">
          {STEPS.map((_, i) => (
            <button key={i}
              className={`onboard-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              onClick={() => setStep(i)} aria-label={`Step ${i + 1}`} />
          ))}
        </div>

        <div className="onboard-icon-wrap">
          <Icon size={40} />
        </div>
        <h2 className="onboard-title">{current.title}</h2>
        <p className="onboard-subtitle">{current.subtitle}</p>

        <div className="onboard-content">{current.body}</div>

        <div className="onboard-actions">
          {step > 0 && (
            <button className="onboard-btn-back" onClick={() => setStep(s => s - 1)}>Back</button>
          )}
          <button className="onboard-btn-next" onClick={isLast ? handleFinish : () => setStep(s => s + 1)}>
            {isLast ? 'Get Started' : 'Next'}
          </button>
        </div>

        <button className="onboard-skip" onClick={handleFinish}>Skip intro</button>
      </div>
    </div>
  );
}
