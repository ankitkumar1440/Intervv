import React, { useState } from 'react';
import { login as loginApi }  from '../../services/authApi';
import { useAuth }            from '../../context/AuthContext';
import './AuthPage.css';

const LoginPage = ({ onSwitch, onHome }) => {
  const { login }           = useAuth();
  const [form,    setForm]   = useState({ email: '', password: '' });
  const [error,   setError]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await loginApi(form);
      login(user, token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">🎙️</div>
        <h1 className="auth-card__title">Welcome back</h1>
        <p  className="auth-card__subtitle">Log in to your AI Assistant</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label>Email</label>
            <input
              type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com" required
            />
          </div>
          <div className="auth-form__field">
            <label>Password</label>
            <input
              type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="••••••••" required
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="auth-back">
          <button onClick={onHome}>← Back to home</button>
        </p>

        <p className="auth-switch">
          No account? <button onClick={onSwitch}>Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
