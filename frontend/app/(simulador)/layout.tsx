import React from "react";
import AppBar from "@/components/AppBar";

interface SimuladorLayoutProps {
    children: React.ReactNode;
}

export default function SimuladorLayout({ children }: SimuladorLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-[#0b0f19] text-white">
            <AppBar />
            <main className="flex-1 min-w-0 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}