import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import SampleQuestions from './components/SampleQuestions';
import { sendChatMessage, resetConversation } from './utils/api';
import './styles/App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [apiUrl, setApiUrl] = useState('http://localhost:8000');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversationId && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm your Apple Watch specialist. I can help you with questions about the latest Apple Watch models including Series 10, Ultra 2, and watchOS 11. What would you like to know?",
        timestamp: new Date()
      }]);
    }
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(apiUrl, currentMessage, conversationId);
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please check if the backend server is running and try again.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConversation = async () => {
    setIsLoading(true);
    try {
      await resetConversation(apiUrl, conversationId);
      setMessages([{
        role: 'assistant',
        content: "Conversation reset! I'm ready to help you with Apple Watch questions again.",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (question) => {
    setInputMessage(question);
  };

  return (
    <div className="app">
      <Header 
        apiUrl={apiUrl}
        setApiUrl={setApiUrl}
        onReset={handleResetConversation}
        isLoading={isLoading}
      />
      
      <div className="chat-container">
        <div className="chat-box">
          <div className="messages-container">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            
            {isLoading && (
              <div className="typing-indicator">
                <div className="message-avatar assistant">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <MessageInput
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>

        <SampleQuestions onQuestionClick={handleSampleQuestion} />
      </div>
    </div>
  );
};

export default App;