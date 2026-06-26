"use client";

import InversorProfile from "@/components/InversorProfile";
import { useAuth } from "@/app/auth/AuthContext";
import { useEffect } from "react";

export default function PerfilPage() {
        const { verificarSesion, loading } = useAuth();
    
        useEffect(() => {
            verificarSesion();
        }, [verificarSesion]);
    
        if (loading) {
            return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
        }
    return <InversorProfile />
}