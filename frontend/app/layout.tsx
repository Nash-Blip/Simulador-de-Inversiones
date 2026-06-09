import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserMenu from '@/components/UserMenu';
import NavBar from '@/components/NavBar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simulador de Inversiones",
  description: "Simulador de inversiones presentado como trabajo practico para la materia programacion 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-800 text-white">
        <header className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-green-600">
          <span className="text-xl font-bold text-green-400">Simulador de Inversiones</span>
          <UserMenu/>
          <NavBar/>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-gray-800 px-6 py-4 text-center text-sm text-green-600 border-t border-green-600">
          Simulador de Inversiones — Programación III
        </footer>
      </body>
    </html>
  );
}