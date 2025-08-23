import React from 'react';
import '../styles/MessageInput.css';

const MessageInput = ({ inputMessage, setInputMessage, onSendMessage, isLoading }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="input-container">
      <textarea
        className="message-input"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask me about Apple Watch Series 10, Ultra models, or watchOS 11..."
        rows={1}
        disabled={isLoading}
      />
      <button
        className="send-btn"
        onClick={onSendMessage}
        disabled={!inputMessage.trim() || isLoading}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13"/>
          <path d="M22 2L15 22L11 13L2 9L22 2z"/>
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;