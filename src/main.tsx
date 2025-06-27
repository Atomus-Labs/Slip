import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import { ToastManager } from './components/ToastManager';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ToastManager />
      <Toaster 
        position="bottom-right"
        richColors={false}
        closeButton={true}
        duration={4000} // 4 second timer by default
        gap={12}
        expand={true}
        visibleToasts={5}
        pauseWhenPageIsHidden={true}
        toastOptions={{
          style: {
            background: 'var(--toast-bg)',
            border: '1px solid var(--toast-border)',
            color: 'var(--toast-text)',
          },
          className: 'toast-custom',
          duration: 4000, // Default 4 seconds
        }}
      />
    </ThemeProvider>
  </StrictMode>
);