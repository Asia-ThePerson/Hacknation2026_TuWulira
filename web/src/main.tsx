import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { ensureFreshData } from './demo.ts';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/layout.css';
import './patient/intake.css';
import './clinic/clinic.css';

ensureFreshData();

// Offline after first load: the service worker (built by vite.config.ts) caches the whole app.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {
    /* still works online; offline reload is the only thing lost */
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
