import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ChatMessage from '../components/ChatMessage';
import sampleData from '../aiData/sampleData.json';
import sampleProductData from '../aiData/sampleProductdata.json';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [theme, setTheme] = useState('light');
  const chatEndRef = useRef(null);

  // Initial Suggestions Cards
  const initialCards = ['Jeans', 'Smartphone', 'Laptop', 'T-Shirt'];

  useEffect(() => {
    // Scroll to bottom on new message
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      timestamp: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Bot Logic
    setTimeout(() => {
      let botResponse = "Sorry, I did not understand your query!";
      let isProductList = false;

      // 1. Check if it's a main product query (e.g., "Jeans")
      const mainProductMatch = sampleData.find(
        (item) => item.question.toLowerCase() === text.toLowerCase()
      );

      if (mainProductMatch) {
        botResponse = mainProductMatch.response;
        setCurrentProduct(mainProductMatch.question);
      } else {
        // 2. Check if it's a budget query (e.g., "500 - 1000")
        // If we have a current product, try to combine them
        let searchString = text;
        if (currentProduct) {
          searchString = `${currentProduct} ${text}`;
        }

        const productMatch = sampleProductData.find(
          (item) => item.question.toLowerCase() === searchString.toLowerCase()
        );

        if (productMatch) {
          botResponse = productMatch.response;
          isProductList = true;
        } else {
            // Direct match in case user types "Jeans 500 - 1000" directly
            const directMatch = sampleProductData.find(
                (item) => item.question.toLowerCase() === text.toLowerCase()
            );
            if (directMatch) {
                botResponse = directMatch.response;
                isProductList = true;
            }
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: botResponse,
        timestamp: getCurrentTime(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleCardClick = (product) => {
    handleSend(product);
  };

  const handleSave = () => {
    if (messages.length === 0) return;
    
    const existingHistory = JSON.parse(localStorage.getItem('pastConversations') || '[]');
    const newHistory = [...existingHistory, { id: Date.now(), messages, date: new Date().toISOString() }];
    
    localStorage.setItem('pastConversations', JSON.stringify(newHistory));
    alert('Conversation saved to history!');
  };

  const handleNewSuggestion = () => {
    // Save current conversation before resetting
    if (messages.length > 0) {
        handleSave();
    }
    setMessages([]);
    setCurrentProduct(null);
    setInput('');
  };

  const handleFeedback = (msgId, feedbackData) => {
    setMessages(prev => prev.map(msg => {
        if (msg.id === msgId) {
            return { ...msg, ...feedbackData };
        }
        return msg;
    }));
  };

  return (
    <div className="app-container">
      <Sidebar onNewSuggestion={handleNewSuggestion} />
      
      <div className="main-content">
        <header>
          <h1>Product Recommendation AI</h1>
          <div>
            <span>Light </span>
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>⚙️</button>
          </div>
        </header>

        <div className="chat-area">
          {messages.length === 0 ? (
            <div className="initial-render">
              <h2>Hi, Please tell me what you want?</h2>
              <div className="cards-grid">
                {initialCards.map((card) => (
                  <div key={card} className="card" onClick={() => handleCardClick(card)}>
                    <h3>{card}</h3>
                    <p>Get immediate AI generated response</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onFeedback={handleFeedback} />
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Please tell me about your query!"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="btn-ask">Ask</button>
          {/* Test expects button[type='button'] for Save */}
          <button type="button" className="btn-save" onClick={handleSave}>Save</button>
        </form>
      </div>
    </div>
  );
}