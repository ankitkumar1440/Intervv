import React, { useEffect, useRef } from 'react';
import './HomePage.css';

const HomePage = ({ onLogin, onSignup }) => {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      el.style.setProperty('--mx', `${x}px`);
      el.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="home" ref={heroRef}>

      {/* Background orbs */}
      <div className="home__orb home__orb--1" />
      <div className="home__orb home__orb--2" />
      <div className="home__orb home__orb--3" />

      {/* Navbar */}
      <nav className="home__nav">
        <div className="home__nav-logo">
          <span className="home__nav-icon">🎙️</span>
          <span className="home__nav-name">InterVV</span>
        </div>
        <div className="home__nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </div>
        <div className="home__nav-actions">
          <button className="home__btn-ghost" onClick={onLogin}>Log In</button>
          <button className="home__btn-solid" onClick={onSignup}>Sign Up Free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="home__hero">
        <div className="home__badge">✦ Powered by Groq LLM</div>
        <h1 className="home__title">
          Your AI Assistant<br />
          <span className="home__title-accent">Speaks Your Language</span>
        </h1>
        <p className="home__subtitle">
          Talk to an AI that truly listens. Speak naturally, get intelligent responses,
          and save every conversation — all in one beautifully simple interface.
        </p>
        <div className="home__hero-actions">
          <button className="home__btn-solid home__btn-large" onClick={onSignup}>
            Get Started — It's Free
          </button>
          <button className="home__btn-ghost home__btn-large" onClick={onLogin}>
            I have an account
          </button>
        </div>

        {/* Floating demo card */}
        <div className="home__demo">
          <div className="home__demo-bar">
            <span /><span /><span />
          </div>
          <div className="home__demo-msg home__demo-msg--user">
            <span className="home__demo-avatar">🧑</span>
            <p>What's the fastest way to learn Python?</p>
          </div>
          <div className="home__demo-msg home__demo-msg--ai">
            <span className="home__demo-avatar">🤖</span>
            <p>Start with small projects — build a todo app, then a web scraper. Practice daily for 30 minutes beats long weekend sessions every time.</p>
          </div>
          <div className="home__demo-input">
            <span className="home__demo-mic">🎙️</span>
            <span className="home__demo-placeholder">Ask me anything…</span>
            <span className="home__demo-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home__features" id="features">
        <h2 className="home__section-title">Everything you need</h2>
        <div className="home__features-grid">
          {[
            { icon: '🎙️', title: 'Voice Input',       desc: 'Speak naturally — your words are transcribed instantly with Web Speech API.' },
            { icon: '🤖', title: 'Groq AI Responses', desc: 'Lightning-fast LLM responses powered by Groq\'s ultra-low latency inference.' },
            { icon: '💾', title: 'Chat History',      desc: 'All your conversations are saved to MongoDB and available anytime.' },
            { icon: '🔐', title: 'Secure Auth',       desc: 'JWT-based authentication keeps your account and chats private.' },
            { icon: '📱', title: 'Works Everywhere',  desc: 'Responsive design works on desktop, tablet, and mobile browsers.' },
            { icon: '⚡', title: 'Instant & Fast',    desc: 'No page reloads — everything updates in real-time as you chat.' },
          ].map(({ icon, title, desc }) => (
            <div className="home__feature-card" key={title}>
              <span className="home__feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="home__how" id="how">
        <h2 className="home__section-title">How it works</h2>
        <div className="home__steps">
          {[
            { n: '01', title: 'Create your account',    desc: 'Sign up in seconds — no credit card needed.' },
            { n: '02', title: 'Speak or type',          desc: 'Use your mic or keyboard to ask anything.' },
            { n: '03', title: 'Get smart answers',      desc: 'Groq AI responds instantly with helpful replies.' },
            { n: '04', title: 'Review past chats',      desc: 'Every conversation is saved and searchable.' },
          ].map(({ n, title, desc }) => (
            <div className="home__step" key={n}>
              <span className="home__step-num">{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="home__cta">
        <h2>Ready to start talking?</h2>
        <p>Join thousands of users already using VoiceAI.</p>
        <button className="home__btn-solid home__btn-large" onClick={onSignup}>
          Create Free Account →
        </button>
      </section>

      {/* Footer */}
      <footer className="home__footer">
        <span>InterVV</span>
        <span>Built with React, Express & Groq</span>
      </footer>

    </div>
  );
};

export default HomePage;