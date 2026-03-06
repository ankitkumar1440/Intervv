import React, { useState } from 'react';
import { signup as signupApi } from '../../services/authApi';
import { useAuth }             from '../../context/AuthContext';
import './AuthPage.css';

const SignupPage = ({ onSwitch, onHome }) => {
  const { login }           = useAuth();
  const [form,    setForm]   = useState({ name: '', email: '', password: '' });
  const [error,   setError]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token, user } = await signupApi(form);
      login(user, token);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__logo">🎙️</div>
        <h1 className="auth-card__title">Create account</h1>
        <p  className="auth-card__subtitle">Start using your AI Assistant</p>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label>Name</label>
            <input
              type="text" name="name"
              value={form.name} onChange={handleChange}
              placeholder="Your name" required
            />
          </div>
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
              placeholder="Min. 6 characters" required minLength={6}
            />
          </div>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-back">
          <button onClick={onHome}>← Back to home</button>
        </p>
        <p className="auth-switch">
          Already have an account? <button onClick={onSwitch}>Log in</button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
