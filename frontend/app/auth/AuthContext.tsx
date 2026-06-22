"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Inversor } from "@/types/index";

interface AuthContextType {
    inversor: Inversor | null;
    loading: boolean;
    verificarSesion: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
    inversor: null,
    loading: true,
    verificarSesion: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [inversor, setInversor] = useState<Inversor | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSessionExpired, setIsSessionExpired] = useState(false);

    const verificarSesion = useCallback(async () => {
        try {
            const response = await fetch("http://localhost:3000/inversor/perfil", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                setInversor(data);
                setIsSessionExpired(false);
                return true;
            } else if (response.status === 401) {
                setIsSessionExpired(true);
                return false;
            }
            return false;
        } catch (error) {
            console.error("Error de red al verificar sesión:", error);
            setIsSessionExpired(true);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        verificarSesion();
    }, [verificarSesion]);

    const redirigirAlLogin = () => {
        setIsSessionExpired(false);
        window.location.href = "/auth/login";
    };

    return (
        <AuthContext.Provider value={{ inversor, loading, verificarSesion }}>
            {isSessionExpired && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Sesión Expirada
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            Tu sesión ha caducado. Por seguridad, debés volver a autenticarte para operar en el simulador.
                        </p>
                        <button
                            onClick={redirigirAlLogin}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            )}

            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);