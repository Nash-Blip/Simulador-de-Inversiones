'use client';
import { useAuth } from "@/app/auth/AuthContext";
import CreateActivos from "@/components/CreateActivos";
import { useEffect } from "react";

export default function CreationActivosPage() {
            const { verificarSesion, loading } = useAuth();
        
            useEffect(() => {
                verificarSesion();
            }, [verificarSesion]);
        
            if (loading) {
                return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
            }
    return <CreateActivos/>
}