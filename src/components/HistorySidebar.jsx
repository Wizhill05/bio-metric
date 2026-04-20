import React from 'react';
import { supabase } from '../supabaseClient';
import {
  PersonIcon, HistoryIcon, SunIcon, MoonIcon,
  PowerIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon,
} from './Icons';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
}

export default function HistorySidebar({
  isOpen, onToggle, history, onSelectHistory, onDeleteHistory,
  user, isDarkMode, onToggleDark, onLogout, onNewSearch, activeHistoryId, onLoginClick
}) {
  return (
    <aside className={`history-sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
        {isOpen ? <ChevronLeftIcon size={14} /> : <ChevronRightIcon size={14} />}
      </button>

      {isOpen ? (
        <>
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              <PersonIcon size={20} />
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-email" title={user?.email || "Guest"}>{user?.email || "Guest"}</div>
              <div className="sidebar-user-badge">{user ? "Researcher" : "Guest User"}</div>
            </div>
          </div>

          <div className="sidebar-divider" />

          <div style={{ padding: '16px' }}>
            <button className="search-btn" style={{ width: '100%', padding: '10px' }} onClick={onNewSearch}>
              + New Question
            </button>
          </div>

          <div className="sidebar-history-header">
            <HistoryIcon size={14} /> Search History
          </div>

          <div className="sidebar-history-list">
            {!user ? (
              <div className="sidebar-empty">
                Login to save chat history.
              </div>
            ) : history.length === 0 ? (
              <div className="sidebar-empty">
                No searches yet.<br />Start by asking a health question!
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id}
                  className={`sidebar-history-item ${activeHistoryId === item.id ? 'active' : ''}`}
                  onClick={() => onSelectHistory(item)}>
                  <div className="sidebar-item-query">{item.query}</div>
                  <div className="sidebar-item-date">{formatDate(item.created_at)}</div>
                  <button className="sidebar-item-delete"
                    onClick={e => { e.stopPropagation(); onDeleteHistory(item.id); }}
                    aria-label="Delete">
                    <TrashIcon size={12} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-controls">
            <button className="sidebar-control-btn" onClick={onToggleDark} id="sidebar-theme-toggle">
              {isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            {user ? (
              <button className="sidebar-control-btn logout" onClick={onLogout} id="sidebar-logout-btn">
                <PowerIcon size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <button className="sidebar-control-btn" onClick={onLoginClick}>
                <PersonIcon size={16} />
                <span>Log In</span>
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="sidebar-icon-rail">
          <div className="sidebar-avatar-sm">
            <PersonIcon size={18} />
          </div>
          <button className="sidebar-rail-btn" onClick={onToggleDark}
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            {isDarkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
          {user ? (
            <button className="sidebar-rail-btn logout" onClick={onLogout} title="Log Out">
              <PowerIcon size={16} />
            </button>
          ) : (
            <button className="sidebar-rail-btn" onClick={onLoginClick} title="Log In">
              <PersonIcon size={16} />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
