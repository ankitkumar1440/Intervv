import React from 'react';
import './ChatMessage.css';

const AVATAR = { user: '🧑', assistant: '🤖' };
const LABEL  = { user: 'You',  assistant: 'AI'  };

const ChatMessage = ({ role, content }) => (
  <div className={`chat-message chat-message--${role}`}>
    <div className="chat-message__avatar">{AVATAR[role]}</div>
    <div className="chat-message__body">
      <span className="chat-message__label">{LABEL[role]}</span>
      <p className="chat-message__text">{content}</p>
    </div>
  </div>
);

export default ChatMessage;
