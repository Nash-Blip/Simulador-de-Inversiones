'use client';

import { useEffect, useCallback } from 'react';
import { useAuth } from '@/app/auth/AuthContext';
import { InversorRol } from '@/types';

interface RouteGuardProps {
    allowedRole: InversorRol;
    redirectTo: string;
    children: React.ReactNode;
}

export default function RouteGuard({ allowedRole, redirectTo, children }: RouteGuardProps) {
    const { inversor, loading } = useAuth();

    const redirect = useCallback(() => {
        window.location.replace(redirectTo);
    }, [redirectTo]);

    useEffect(() => {
        if (!loading && inversor) {
            if (inversor.rol !== allowedRole) {
                redirect();
            }
        }
    }, [loading, inversor, allowedRole, redirect]);

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                redirect();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, [redirect]);

    if (loading) {
        return <p className="text-center mt-10 text-gray-400 animate-pulse">Cargando...</p>;
    }

    if (inversor && inversor.rol !== allowedRole) {
        return <p className="text-center mt-10 text-gray-400 animate-pulse">Redirigiendo...</p>;
    }

    return <>{children}</>;
}
