'use client';
import { useAuth } from "@/app/auth/AuthContext";
import ListInversores from "@/components/ListInversores";
import { useEffect } from "react";

export default function ListaInversoresPage() {
            const { verificarSesion, loading } = useAuth();
        
            useEffect(() => {
                verificarSesion();
            }, [verificarSesion]);
        
            if (loading) {
                return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
            }
    return <ListInversores/>
}