import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { AuthProvider } from "../auth/AuthContext";

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
        <div>
            <AuthProvider>
            <NavBar />
            <main className="flex-1 flex flex-col">
                {children}
            </main>
            <Footer />
            </AuthProvider>
        </div>
    );
}