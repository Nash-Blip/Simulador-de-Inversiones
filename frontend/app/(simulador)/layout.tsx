import React from "react";
import AppBar from "@/components/AppBar";
import { AuthProvider } from "../auth/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import { InversorRol } from "@/types";

interface SimuladorLayoutProps {
    children: React.ReactNode;
}

export default function SimuladorLayout({ children }: SimuladorLayoutProps) {
    return (
        <AuthProvider>
            <RouteGuard allowedRole={InversorRol.USER} redirectTo="/mercado">
                <div className="flex min-h-screen w-full bg-[#0b0f19] text-white">
                    <AppBar />
                    <main className="flex-1 min-w-0 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </RouteGuard>
        </AuthProvider>
    );
}