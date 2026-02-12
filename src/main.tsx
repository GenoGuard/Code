import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App-with-router';
import { ThemeProvider } from './app/providers/ThemeProvider';
import './styles/index.css';  // ← FIXED PATH

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);