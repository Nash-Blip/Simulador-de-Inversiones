'use client'; 

export const dynamic = 'force-dynamic';

import React, { useEffect } from "react";
import AppBarAdmin from "@/components/AppBarAdmin";
import { AuthProvider, useAuth } from "@/app/auth/AuthContext"; // 👈 Importamos useAuth
import RouteGuard from "@/components/RouteGuard";
import { InversorRol } from "@/types";

// Componente interno para tener acceso al contexto de Auth
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { inversor, loading } = useAuth();

    // 🛑 Si está verificando la sesión, devolvemos null o un esqueleto vacío.
    // Esto evita que el navegador guarde una captura visual con datos sensibles en su caché.
    if (loading) {
        return (
            <div className="min-h-screen w-full bg-[#0b0f19] flex items-center justify-center text-gray-400">
                Cargando...
            </div>
        );
    }

    // Si terminó de cargar y misteriosamente no hay inversor (porque se deslogueó), no renderizamos el panel
    if (!inversor) return null;

    return (
        <RouteGuard allowedRole={InversorRol.ADMIN} redirectTo="/admin/inversores">
            <div className="flex min-h-screen w-full bg-[#0b0f19] text-white">
                <AppBarAdmin />
                <main className="flex-1 min-w-0 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </RouteGuard>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const controlarBFCache = (event: PageTransitionEvent) => {
            if (event.persisted) {
                window.location.reload();
            }
        };
        window.addEventListener('pageshow', controlarBFCache);
        return () => window.removeEventListener('pageshow', controlarBFCache);
    }, []);

    return (
        <AuthProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AuthProvider>
    );
}