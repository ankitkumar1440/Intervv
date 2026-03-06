import axios from 'axios';

const TOKEN_KEY = 'ai_assistant_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Send a message — creates a new chat if no chatId given.
 * @returns {{ reply: string, chatId: string }}
 */
export const sendMessage = async (message, chatId = null) => {
  const url = chatId ? `/api/chat/${chatId}` : '/api/chat';
  const { data } = await api.post(url, { message });
  return data; // { reply, chatId }
};

/**
 * Fetch all chat sessions for the logged-in user.
 * @returns {Array<{ _id, title, createdAt }>}
 */
export const getChatSessions = async () => {
  const { data } = await api.get('/api/chat');
  return data.sessions;
};

/**
 * Fetch all messages in a specific chat session.
 * @returns {{ _id, title, messages: Array<{role, content}> }}
 */
export const getChatById = async (chatId) => {
  const { data } = await api.get(`/api/chat/${chatId}`);
  return data.chat;
};

export const deleteChat = async (chatId) => {
  await api.delete(`/api/chat/${chatId}`);
};
