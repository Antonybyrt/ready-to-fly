import Header from "@/components/ui/Header";
import { MantineProvider } from '@mantine/core';
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
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
