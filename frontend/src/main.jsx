import React    from 'react';
import ReactDOM from 'react-dom/client';
import App      from './App';
import { AuthProvider } from './context/AuthContext';

// Global base styles loaded once at the top
import './styles/base/reset.css';
import './styles/base/variables.css';
import './styles/base/layout.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
