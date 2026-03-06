import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
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
