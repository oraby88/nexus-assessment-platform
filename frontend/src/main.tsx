import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Token vars first as a direct module import so Vite HMR reliably reloads theme changes
// (an @import chain inside globals.css can leave the dev server serving stale token values).
import './styles/tokens.css';
import './styles/fonts.css';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
