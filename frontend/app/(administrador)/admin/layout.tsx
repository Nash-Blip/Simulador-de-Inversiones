import React from "react";
import AppBarAdmin from "@/components/AppBarAdmin";
import { AuthProvider } from "@/app/auth/AuthContext";
import RouteGuard from "@/components/RouteGuard";
import { InversorRol } from "@/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <RouteGuard allowedRole={InversorRol.ADMIN} redirectTo="/mercado">
                <div className="flex min-h-screen w-full bg-[#0b0f19] text-white">
                    <AppBarAdmin />
                    <main className="flex-1 min-w-0 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </RouteGuard>
        </AuthProvider>
    );
}