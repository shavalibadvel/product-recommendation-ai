import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('All Ratings');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('pastConversations') || '[]');
    // Sort newest first
    setHistory(saved.reverse());
  }, []);

  const filteredHistory = history.filter((session) => {
    if (filter === 'All Ratings') return true;
    
    // Check if any message in the session has the specified rating
    const ratingValue = parseInt(filter.split(' ')[0]);
    return session.messages.some(msg => msg.rating === ratingValue);
  });

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header>
          <h1>Product Recommendation AI</h1>
        </header>

        <div className="history-container">
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Previous Suggestions</h2>
          
          <div className="filter-section">
            <label>Filter by rating: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="All Ratings">All Ratings</option>
              <option value="5 Stars">5 Stars</option>
              <option value="4 Stars">4 Stars</option>
              <option value="3 Stars">3 Stars</option>
            </select>
          </div>

          <h3>Today's chats</h3>
          {filteredHistory.length === 0 ? (
            <p>No previous conversations found.</p>
          ) : (
            filteredHistory.map((session, index) => (
              <div key={session.id || index} className="history-card">
                {session.messages.map((msg, i) => (
                  <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <strong>{msg.sender === 'ai' ? 'Product Recommendation AI' : 'You'}</strong>
                    <p>{Array.isArray(msg.text) ? msg.text[0] : msg.text}</p>
                    <small>{msg.timestamp}</small>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}