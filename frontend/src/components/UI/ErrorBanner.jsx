import React from 'react';
import './ErrorBanner.css';

const ErrorBanner = ({ message, onClose }) => (
  <div className="error-banner" role="alert">
    <span>⚠️ {message}</span>
    {onClose && (
      <button className="error-banner__close" onClick={onClose} title="Dismiss">✕</button>
    )}
  </div>
);

export default ErrorBanner;