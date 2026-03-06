import React, { useState, useRef, useEffect } from 'react';

import { useAuth }              from './context/AuthContext';
import { sendMessage, getChatSessions, getChatById, deleteChat } from './services/chatApi';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';

import HomePage   from './pages/HomePage';
import LoginPage   from './components/Auth/LoginPage';
import SignupPage  from './components/Auth/SignupPage';
import ChatSidebar from './components/UI/ChatSidebar';
import AppHeader   from './components/UI/AppHeader';
import ErrorBanner from './components/UI/ErrorBanner';
import ChatWindow  from './components/Chat/ChatWindow';
import ChatInput   from './components/Chat/ChatInput';

import './styles/app.css';

function App() {
  const { isLoggedIn } = useAuth();
  const [authPage,     setAuthPage]     = useState('home');
  const [showHome,     setShowHome]     = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);
  const [sessions,     setSessions]     = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages,     setMessages]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);

  // Refs — never cause re-renders
  const chatEndRef    = useRef(null);
  const activeChatRef = useRef(null);
  const loadingRef    = useRef(false);
  const textareaRef   = useRef(null);

  // Keep refs in sync
  useEffect(() => { activeChatRef.current = activeChatId; }, [activeChatId]);
  useEffect(() => { loadingRef.current    = loading;      }, [loading]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (isLoggedIn) loadSessions(); }, [isLoggedIn]);

  // Speech hook — receives text via callback, writes directly to textarea DOM
  const { isListening, isSupported, error: speechError, clearError, startListening, stopListening } =
  useSpeechRecognition(
    // Live text — show as typing
    (liveText) => {
      if (textareaRef.current) textareaRef.current.value = liveText;
    },
    // Final text — send message
    (finalText) => {
      if (textareaRef.current) textareaRef.current.value = finalText;
      setTimeout(() => handleSend(), 100);
    }
  );

  const visibleError = error || speechError;

  const loadSessions = async () => {
    try { const data = await getChatSessions(); setSessions(data); }
    catch { /* silent */ }
  };

  // Core send — reads textarea DOM value directly, no React state involved
  const handleSend = async () => {
    if (loadingRef.current) return;
    const message = textareaRef.current?.value?.trim();
    if (!message) return;

    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    textareaRef.current.value = ''; // clear after user message in chat, before AI response
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
    } catch { setError('Could not load chat.'); }
  };

  const handleNewChat    = () => { setActiveChatId(null); setMessages([]); setError(null); };
  const handleDeleteChat = async (chatId) => {
    await deleteChat(chatId);
    setSessions(prev => prev.filter(s => s._id !== chatId));
    if (activeChatId === chatId) handleNewChat();
  };

  if (showHome) {
    return <HomePage onLogin={() => { setShowHome(false); setAuthPage('login'); }} onSignup={() => { setShowHome(false); setAuthPage('signup'); }} onChat={() => setShowHome(false)} />
  }

  if (!isLoggedIn) {
    return authPage === 'home'
      ? <HomePage  onLogin={() => setAuthPage('login')} onSignup={() => setAuthPage('signup')} />
      : authPage === 'login'
      ? <LoginPage  onSwitch={() => setAuthPage('signup')} onHome={() => setAuthPage('home')} />
      : <SignupPage onSwitch={() => setAuthPage('login')}  onHome={() => setAuthPage('home')} />;
  }

  return (
    <div className="app-layout">
      <ChatSidebar
        sessions={sessions} activeChatId={activeChatId}
        onSelect={handleSelectChat} onNew={handleNewChat} onDelete={handleDeleteChat}
        onHome={() => setShowHome(true)}
        isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
      />
      <div className="app-main">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <ChatWindow history={messages} loading={loading} chatEndRef={chatEndRef} />
        {visibleError && (
          <ErrorBanner message={visibleError} onClose={() => { setError(null); clearError(); }} />
        )}
        <ChatInput
          onSend={handleSend} onMicToggle={handleMicToggle}
          isListening={isListening} isMicSupported={isSupported}
          isLoading={loading} textareaRef={textareaRef}
        />
      </div>
    </div>
  );
}

export default App;