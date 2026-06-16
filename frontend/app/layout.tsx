import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat", 
});

export const metadata: Metadata = {
  title: "Simulador de Inversiones",
  description: "Simulador de inversiones presentado como trabajo práctico para la materia programación 3.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} min-h-screen antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#0b0f19] text-white">
          {children}        
      </body>
    </html>
  );
}