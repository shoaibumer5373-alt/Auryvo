import '@fontsource-variable/dm-sans';
import './styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { readStoredSettings } from './lib/storage';

const initialSettings = readStoredSettings();
document.documentElement.classList.toggle('dark', initialSettings.theme === 'dark');
document.documentElement.dataset.accent = initialSettings.accent;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
