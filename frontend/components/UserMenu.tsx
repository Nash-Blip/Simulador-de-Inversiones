"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Perfil } from '../types/index';

export default function UserMenu() {
    const router = useRouter();
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const [usuario, setUsuario] = useState<Perfil | null>(null);

    async function handleLogout() {
        await fetch("http://localhost:3000/auth/logout", {
            method: 'POST',
            credentials: 'include',
        });
        router.push('/auth/login');
    }

    useEffect(() => {
        const fetchPerfil = async () => {
            const response = await fetch("http://localhost:3000/inversor/perfil",
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            const data = await response.json();
            if(response.ok){
                setUsuario(data);
            }
        }

        fetchPerfil();
    }, []);

    function handleMostrar() {
        setMostrarMenu(!mostrarMenu);
    }

    return (
        <div>
            <button onClick={handleMostrar}>Mi Cuenta</button>
            {mostrarMenu && (
                <div>
                    <p>{usuario?.nombre}</p>
                    <p>{usuario?.email}</p>
                    <button onClick={handleLogout}>Cerrar sesión</button>
                    <button onClick={() => router.push('/inversor/cambiar')}>Cambiar Contraseña</button>
                </div>
            )}
        </div>
    );
}