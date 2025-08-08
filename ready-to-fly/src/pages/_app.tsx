import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Header from '@/components/ui/Header';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ToastProvider, useToast } from '@/components/ui/toast-container';
import { ErrorService } from '@/services/error.service';
import '@/styles/globals.css';

const ToastInitializer = () => {
  const { showToast } = useToast();

  useEffect(() => {
    ErrorService.setToastHandler((toast) => {
      showToast(toast);
    });
  }, [showToast]);

  return null;
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ToastInitializer />
        <Header />
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  );
}
