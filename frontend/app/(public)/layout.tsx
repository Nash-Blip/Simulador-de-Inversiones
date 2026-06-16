import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "Simulador de Inversiones",
    description: "Simulador de inversiones presentado como trabajo práctico para la materia programación 3.",
};

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
            <body className="min-h-screen flex flex-col bg-[#0b0f19] text-white">
                <NavBar />
                <main className="flex-1 flex flex-col">
                    {children}
                </main>
                <Footer />
            </body>
    );
}