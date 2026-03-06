import React from 'react';
import './MicButton.css';

const MicButton = ({ isListening, onClick, disabled }) => (
  <button
    className={`mic-btn${isListening ? ' mic-btn--active' : ''}`}
    onClick={onClick}
    disabled={disabled}
    title={isListening ? 'Stop listening' : 'Start speaking'}
    aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
  >
    <span className="mic-btn__icon">{isListening ? '⏹' : '🎙️'}</span>
    {isListening && <span className="mic-btn__pulse" aria-hidden="true" />}
  </button>
);

export default MicButton;
