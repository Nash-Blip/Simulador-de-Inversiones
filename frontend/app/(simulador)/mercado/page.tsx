'use client';

import Mercado from "@/components/Mercado";
import { useAuth } from "@/app/auth/AuthContext";
import { useEffect } from "react";

export default function MercadoPage() {
        const { verificarSesion, loading } = useAuth();
    
        useEffect(() => {
            verificarSesion();
        }, [verificarSesion]);
    
        if (loading) {
            return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
        }
    return <Mercado />
}