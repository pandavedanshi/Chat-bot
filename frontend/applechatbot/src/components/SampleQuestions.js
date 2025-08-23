import React from 'react';
import '../styles/SampleQuestions.css';

const SampleQuestions = ({ onQuestionClick }) => {
  const sampleQuestions = [
    "What's new in Apple Watch Series 10?",
    "Compare Ultra 2 vs Series 10",
    "Tell me about watchOS 11 features",
    "Which Apple Watch has the best battery life?",
    "What are the display sizes available?",
    "Should I upgrade from Series 9?"
  ];

  return (
    <div className="sample-questions">
      {sampleQuestions.map((question, index) => (
        <button
          key={index}
          className="sample-question"
          onClick={() => onQuestionClick(question)}
        >
          {question}
        </button>
      ))}
    </div>
  );
};

export default SampleQuestions;