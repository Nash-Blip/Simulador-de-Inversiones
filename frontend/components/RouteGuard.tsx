'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/auth/AuthContext';
import { InversorRol } from '@/types';

interface RouteGuardProps {
    allowedRole: InversorRol;
    redirectTo: string;
    children: React.ReactNode;
}

export default function RouteGuard({ allowedRole, redirectTo, children }: RouteGuardProps) {
    const { inversor, loading } = useAuth();

    useEffect(() => {
        if (!loading && inversor) {
            if (inversor.rol !== allowedRole) {
                window.location.replace(redirectTo);
            }
        }
    }, [loading, inversor, allowedRole, redirectTo]);

    if (loading) {
        return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
    }

    if (inversor && inversor.rol !== allowedRole) {
        return <p className="text-center mt-10 text-gray-400 animate-pulse">Redirigiendo...</p>;
    }

    return <>{children}</>;
}
