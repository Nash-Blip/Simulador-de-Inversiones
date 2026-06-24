"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Inversor } from "@/types/index";
import { logout as apiLogout } from '@/service/Auth.service';

interface AuthContextType {
    inversor: Inversor | null;
    loading: boolean;
    verificarSesion: () => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    inversor: null,
    loading: true,
    verificarSesion: async () => false,
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [inversor, setInversor] = useState<Inversor | null>(null);
    const [loading, setLoading] = useState(true);

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
                return true;
            }

            if (response.status === 401) {
                setInversor(null);
                return false;
            }
            return false;
        } catch (error) {
            console.error("Error de red al verificar sesión:", error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setInversor(null);
            await apiLogout();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        } finally {
            window.location.href = "/";
        }
    }, []);

    useEffect(() => {
        verificarSesion();

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                setLoading(true);
                setInversor(null);
                verificarSesion();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, [verificarSesion]);

    return (
        <AuthContext.Provider value={{ inversor, loading, verificarSesion, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);