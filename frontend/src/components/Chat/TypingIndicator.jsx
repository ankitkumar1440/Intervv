import React from 'react';
import './TypingIndicator.css';

// Shown in the chat window while the AI is generating a response
const TypingIndicator = () => (
  <div className="chat-message chat-message--assistant">
    <div className="chat-message__avatar">🤖</div>
    <div className="chat-message__body">
      <span className="chat-message__label">AI</span>
      <div className="typing">
        <span /><span /><span />
      </div>
    </div>
  </div>
);

export default TypingIndicator;
