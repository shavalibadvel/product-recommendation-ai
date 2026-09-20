import React, { useState } from 'react';

export default function ChatMessage({ message, onFeedback }) {
  const [showStars, setShowStars] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [textFeedback, setTextFeedback] = useState('');

  const isAI = message.sender === 'ai';

  const handleThumbsUp = () => {
    setShowStars(true);
    onFeedback(message.id, { thumbs: 'up' });
  };

  const handleThumbsDown = () => {
    setShowModal(true);
    onFeedback(message.id, { thumbs: 'down' });
  };

  const submitFeedback = () => {
    onFeedback(message.id, { feedbackText: textFeedback });
    setShowModal(false);
  };

  const rateStars = (rating) => {
    onFeedback(message.id, { rating });
    setShowStars(false);
  };

  return (
    <div className={`message-row ${message.sender}`}>
      <div className="avatar"></div>
      <div className="message-content">
        <div className="message-header">
          <strong>{isAI ? 'Product Recommendation AI' : 'You'}</strong>
          <span>{message.timestamp}</span>
        </div>
        <div className="message-text">
          {Array.isArray(message.text) ? (
            message.text.map((line, i) => <div key={i}>{line}</div>)
          ) : (
            message.text
          )}
        </div>

        {/* Feedback UI (Only for AI) */}
        {isAI && (
          <div className="feedback-actions">
            {!showStars && !message.rating && (
              <>
                <button onClick={handleThumbsUp}>👍</button>
                <button onClick={handleThumbsDown}>👎</button>
              </>
            )}
            
            {showStars && (
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} onClick={() => rateStars(star)}>★</span>
                ))}
              </div>
            )}

            {message.rating && <div className="stars">Rating: {message.rating} ★</div>}
          </div>
        )}
      </div>

      {/* Feedback Modal for Thumbs Down */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Provide Additional Feedback</h3>
            <textarea 
              value={textFeedback} 
              onChange={(e) => setTextFeedback(e.target.value)}
              placeholder="Tell us what went wrong..."
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={submitFeedback}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}