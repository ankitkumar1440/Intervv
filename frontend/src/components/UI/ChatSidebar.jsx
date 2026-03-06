import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './ChatSidebar.css';

const ChatSidebar = ({ sessions, activeChatId, onSelect, onNew, onDelete }) => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__logo">🎙️</span>
        <span className="sidebar__appname">AI Assistant</span>
      </div>

      <button className="sidebar__new-btn" onClick={onNew}>
        + New Chat
      </button>

      <div className="sidebar__sessions">
        {sessions.length === 0 && (
          <p className="sidebar__empty">No chats yet</p>
        )}
        {sessions.map((s) => (
          <div
            key={s._id}
            className={`sidebar__session${s._id === activeChatId ? ' sidebar__session--active' : ''}`}
            onClick={() => onSelect(s._id)}
          >
            <span className="sidebar__session-title">{s.title || 'Untitled'}</span>
            <button
              className="sidebar__delete-btn"
              onClick={(e) => { e.stopPropagation(); onDelete(s._id); }}
              title="Delete chat"
            >
              🗑
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <span className="sidebar__user-avatar">🧑</span>
          <div>
            <p className="sidebar__user-name">{user?.name}</p>
            <p className="sidebar__user-email">{user?.email}</p>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout} title="Log out">↩</button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
