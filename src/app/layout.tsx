import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AI } from "@/components/chat/chat-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GenUI — Generative UI Copilot",
  description:
    "Motor de Generative UI para agentes de IA: respostas como componentes React tipados, em tempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/*
          AI provider (createAI): disponibiliza useUIState / useActions
          para toda a árvore do chat com tipagem InferUIState / InferActions.
        */}
        <AI>{children}</AI>
      </body>
    </html>
  );
}
