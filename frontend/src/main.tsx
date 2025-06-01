import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

const allowedPaths = ['/login', '/registro'];
const currentPath = window.location.pathname;
if (!allowedPaths.includes(currentPath)) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || !user.token || user.token === 'null' || user.token === '') {
    localStorage.removeItem('user');
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;"><div style="background:#fff3cd;padding:2rem 3rem;border-radius:1rem;box-shadow:0 2px 8px #0001;font-size:1.2rem;color:#856404;text-align:center;">Tu sesión ha expirado o es inválida.<br>Por favor, inicia sesión de nuevo.</div></div>';
    setTimeout(() => { window.location.href = '/login'; }, 1800);
    throw new Error('Sesión inválida');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
