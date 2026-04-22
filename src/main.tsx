import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/hanken-grotesk/wght-italic.css';
import '@fontsource-variable/jetbrains-mono';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
