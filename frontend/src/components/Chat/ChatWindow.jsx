import React from 'react';
import ChatMessage     from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import './ChatWindow.css';

const ChatWindow = ({ history, loading, chatEndRef }) => (
  <main className="chat-window">
    {history.length === 0 && (
      <p className="chat-window__empty">
        <span className="chat-window__empty-icon">🎙️</span>
        Start by speaking or typing a message below.
      </p>
    )}

    {history.map((msg, i) => (
      <ChatMessage key={i} role={msg.role} content={msg.content} />
    ))}

    {loading && <TypingIndicator />}

    <div ref={chatEndRef} />
  </main>
);

export default ChatWindow;
