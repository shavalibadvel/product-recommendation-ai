import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ onNewSuggestion }) {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span>💬 Want new suggestion?</span>
      </div>
      <div>
        {/* Test expects an anchor tag with href="/" containing "Want new suggestion?" */}
        <Link to="/" className="new-chat" onClick={onNewSuggestion}>
          Want new suggestion?
        </Link>
        
        {/* Test expects an anchor tag with href="/history" */}
        <Link 
          to="/history" 
          className={`history-btn ${location.pathname === '/history' ? 'active' : ''}`}
        >
          Previous Suggestions
        </Link>
      </div>
    </div>
  );
}