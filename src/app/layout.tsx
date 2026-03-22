import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Charter — The Music Timeline Game",
  description:
    "Listen to songs and place them in chronological order. A digital party game for 2-10 players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)] bg-gray-950 text-white">
        <GameProvider>{children}</GameProvider>
      </body>
    </html>
  );
}
