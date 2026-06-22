"use client";

import GestionFondos from "@/components/GestionFondos";
import { useAuth } from "@/app/auth/AuthContext";
import { useEffect } from "react";

export default function FondosPage() {
        const { verificarSesion, loading } = useAuth();
    
        useEffect(() => {
            verificarSesion();
        }, [verificarSesion]);
    
        if (loading) {
            return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
        }
    return <GestionFondos />
}