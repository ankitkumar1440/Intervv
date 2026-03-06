import React from 'react';
import MicButton from '../Mic/MicButton';
import './ChatInput.css';

const ChatInput = ({ onSend, onMicToggle, isListening, isMicSupported, isLoading, textareaRef }) => (
  <footer className="chat-input">
    {isListening && <p className="chat-input__listening">🔴 Listening… speak now</p>}
    <div className="chat-input__row">
      {isMicSupported && (
        <MicButton isListening={isListening} onClick={onMicToggle} disabled={isLoading} />
      )}
      <textarea
        ref={textareaRef}
        className="chat-input__textarea"
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        placeholder={isListening ? 'Listening…' : 'Type or speak your message…'}
        rows={1}
      />
      <button className="chat-input__send" onClick={onSend} disabled={isLoading}>
        {isLoading ? '…' : 'Send'}
      </button>
    </div>
    <p className="chat-input__hint">Enter to send · Shift+Enter for new line</p>
  </footer>
);

export default ChatInput;