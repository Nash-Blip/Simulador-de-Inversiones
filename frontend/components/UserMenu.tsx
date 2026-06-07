"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
    const router = useRouter();
    const [mostrarMenu, setMostrarMenu] = useState(false);

    async function handleLogout() {
        await fetch("http://localhost:3000/auth/logout", {
            method: 'POST',
            credentials: 'include',
        });
        router.push('/auth/login');
    }

    function handleMostrar() {
        setMostrarMenu(!mostrarMenu);
    }

    return (
        <div>
            <button onClick={handleMostrar}>Mi Cuenta</button>
            {mostrarMenu && (
                <div>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                    <button onClick={() => router.push('/inversor/cambiar')}>Cambiar Contraseña</button>
                </div>
            )}
        </div>
    );
}