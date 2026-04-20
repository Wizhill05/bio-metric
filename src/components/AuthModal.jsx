import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { MicroscopeIcon, DNAIcon, BookIcon, SearchIcon } from './Icons';

export default function AuthModal({ onClose }) {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const switchTab = (t) => { setTab(t); setError(''); setMessage(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage(''); setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Account created! Check your email to confirm, then sign in.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card" style={{ position: 'relative' }}>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        )}
        <div className="auth-brand">
          <div className="auth-logo-icon">
            <MicroscopeIcon size={40} />
          </div>
          <h1>BioMetric</h1>
          <p>AI-powered answers from peer-reviewed science</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
            Sign In
          </button>
          <button className={`auth-tab-btn ${tab === 'signup' ? 'active' : ''}`} onClick={() => switchTab('signup')}>
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="auth-email">Email</label>
            <input id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com" required autoFocus />
          </div>
          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input id="auth-password" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required minLength={6} />
          </div>

          {error && <div className="auth-error">! {error}</div>}
          {message && <div className="auth-success">+ {message}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? <span className="auth-loading-dots"><span /><span /><span /></span>
              : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button className="auth-switch-btn" onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}>
            {tab === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        <div className="auth-trust-badges">
          <span className="trust-badge"><DNAIcon size={14} /> PubMed</span>
          <span className="trust-badge"><BookIcon size={14} /> Cochrane</span>
          <span className="trust-badge"><SearchIcon size={14} /> Scholar</span>
        </div>
      </div>
    </div>
  );
}
