import React, { useState, useRef, useEffect } from 'react';

import { useAuth } from './context/AuthContext';
import { sendMessage, getChatSessions, getChatById, deleteChat } from './services/chatApi';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

import HomePage from './pages/HomePage';

import LoginPage from './components/Auth/LoginPage';
import SignupPage from './components/Auth/SignupPage';
import ChatSidebar from './components/UI/ChatSidebar';
import AppHeader from './components/UI/AppHeader';
import ErrorBanner from './components/UI/ErrorBanner';
import ChatWindow from './components/Chat/ChatWindow';
import ChatInput from './components/Chat/ChatInput';

import './styles/app.css';

function App() {
  const { isLoggedIn } = useAuth();

  const [authPage, setAuthPage] = useState('home');
  const [showHome, setShowHome] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatEndRef = useRef(null);
  const activeChatRef = useRef(null);
  const loadingRef = useRef(false);
  const textareaRef = useRef(null);
  const speechTimeoutRef = useRef(null);

  useEffect(() => {
    activeChatRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isLoggedIn) loadSessions();
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, []);

  const {
  isListening,
  isSupported,
  error: speechError,
  clearError,
  startListening,
  stopListening
} = useSpeechRecognition(

  // Live typing
  (liveText) => {
    if (textareaRef.current) {
      textareaRef.current.value = liveText;
    }
  },

  // Final transcript AFTER mic stops
  (finalText) => {
    if (textareaRef.current) {
      textareaRef.current.value = finalText;
    }

    // Wait 2 seconds BEFORE sending
    speechTimeoutRef.current = setTimeout(() => {
      handleSend();
      speechTimeoutRef.current = null;
    }, 2000);
  }
);

  const visibleError = error || speechError;

  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (err) {
      console.error("Session load error:", err);
    }
  };

  const handleSend = async () => {
    if (loadingRef.current) return;

    const message = textareaRef.current?.value?.trim();
    if (!message) return;

    setError(null);

    setMessages(prev => [...prev, { role: 'user', content: message }]);

    if (textareaRef.current) textareaRef.current.value = '';

    setLoading(true);

    try {
      const { reply, chatId } = await sendMessage(message, activeChatRef.current);

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      if (!activeChatRef.current) {
        setActiveChatId(chatId);
        activeChatRef.current = chatId;
        await loadSessions();
      }

    } catch (err) {
      console.error("Send error:", err);
      setError(err.response?.data?.error || 'Could not reach the backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      if (textareaRef.current) textareaRef.current.value = '';
      setError(null);
      clearError();
      startListening();
    }
  };

  const handleSelectChat = async (chatId) => {
    try {
      const chat = await getChatById(chatId);
      setActiveChatId(chatId);
      setMessages(chat.messages);
      setError(null);
    } catch {
      setError('Could not load chat.');
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setError(null);
  };

  const handleDeleteChat = async (chatId) => {
    await deleteChat(chatId);
    setSessions(prev => prev.filter(s => s._id !== chatId));
    if (activeChatId === chatId) handleNewChat();
  };

  if (!isLoggedIn) {
  return authPage === 'home'
    ? <HomePage onLogin={() => setAuthPage('login')} onSignup={() => setAuthPage('signup')} />
    : authPage === 'login'
    ? <LoginPage  onSwitch={() => setAuthPage('signup')} onHome={() => setAuthPage('home')} />
    : <SignupPage onSwitch={() => setAuthPage('login')}  onHome={() => setAuthPage('home')} />;
}

  if (showHome) {
  return <HomePage
    onLogin={() => { setShowHome(false); setAuthPage('login'); }}
    onSignup={() => { setShowHome(false); setAuthPage('signup'); }}
    onChat={() => setShowHome(false)}
  />;
}

  return (
    <div className="app-layout">
      <ChatSidebar
        sessions={sessions}
        activeChatId={activeChatId}
        onSelect={handleSelectChat}
        onNew={handleNewChat}
        onDelete={handleDeleteChat}
        onHome={() => { setShowHome(true); }}
      />

      <div className="app-main">
        <AppHeader />

        <ChatWindow
          history={messages}
          loading={loading}
          chatEndRef={chatEndRef}
        />

        {visibleError && (
          <ErrorBanner
            message={visibleError}
            onClose={() => {
              setError(null);
              clearError();
            }}
          />
        )}

        <ChatInput
          onSend={handleSend}
          onMicToggle={handleMicToggle}
          isListening={isListening}
          isMicSupported={isSupported}
          isLoading={loading}
          textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}

export default App;