import type { Metadata } from "next";
import { Montserrat, Roboto } from "next/font/google";
import "./globals.css";
import NavBar from '@/components/NavBar';
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
    <html lang="es" className={`${montserrat.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-800 text-white">
          {/* <NavBar/> */}
        <main className="flex-1">
          {children}
        </main>
        {/* <Footer/>  */}
      </body>
    </html>
  );
}