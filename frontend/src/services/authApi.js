import axios from 'axios';

// Compute a sensible default API base URL when VITE_API_URL isn't provided.
// When the frontend is served from the laptop's network IP (Vite Network URL),
// using the same hostname with port 5000 lets mobile browsers reach the backend
// without requiring manual env edits.
const defaultHost = (typeof window !== 'undefined' && window.location && window.location.hostname)
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultHost,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * @param {{ name, email, password }} data
 * @returns {{ token, user }}
 */
export const signup = async (data) => {
  const { data: res } = await api.post('/api/auth/signup', data);
  return res;
};

/**
 * @param {{ email, password }} data
 * @returns {{ token, user }}
 */
export const login = async (data) => {
  const { data: res } = await api.post('/api/auth/login', data);
  return res;
};
