import React from 'react';
import '../styles/Header.css';

const Header = ({ apiUrl, setApiUrl, onReset, isLoading }) => {
  return (
    <div className="header">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="6"/>
              <polyline points="12,10 12,12 13,13"/>
              <path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05"/>
              <path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/>
            </svg>
          </div>
          <div className="logo-text">
            <h1>Apple Watch Specialist</h1>
            <p>Series 10 • Ultra 2 • watchOS 11</p>
          </div>
        </div>
        
        <div className="header-controls">
          <input
            type="text"
            className="url-input"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="Backend URL"
          />
          <button
            className="reset-btn"
            onClick={onReset}
            disabled={isLoading}
            title="Reset Conversation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;