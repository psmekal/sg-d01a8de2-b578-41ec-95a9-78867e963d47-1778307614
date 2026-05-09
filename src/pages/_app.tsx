import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { ScoreboardProvider } from "@/contexts/ScoreboardContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ScoreboardProvider>
        <Component {...pageProps} />
      </ScoreboardProvider>
    </ThemeProvider>
  );
}