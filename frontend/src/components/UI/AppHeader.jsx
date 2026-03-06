import React from 'react';
import { APP_NAME, APP_SUBTITLE } from '../../constants/app';
import './AppHeader.css';

const AppHeader = () => (
  <header className="app-header">
    <span className="app-header__logo" aria-hidden="true">🎙️</span>
    <div>
      <h1 className="app-header__title">{APP_NAME}</h1>
      <p  className="app-header__subtitle">{APP_SUBTITLE}</p>
    </div>
  </header>
);

export default AppHeader;
