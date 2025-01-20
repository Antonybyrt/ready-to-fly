import Header from "@/components/ui/Header";
import { MantineProvider } from '@mantine/core';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import router from "next/router";
import auth from "@/services/auth.service";

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const handleBeforeUnload = () => {
      auth.logout();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <MantineProvider>
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <Component {...pageProps} />
        </main>
      </div>
    </MantineProvider>
  );
}
