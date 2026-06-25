"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/app/auth/AuthContext'; 


export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const { inversor, loading } = useAuth(); 
    const { logout } = useAuth();

    
    const handleLogout = async () => {
        setIsOpen(false);
        try {
            await logout();            
            window.location.href = "/";
        } catch
        {
            window.location.href = "/";
        }
    };

    
    const obtenerRutaSimulador = () => {
        if (!inversor) return "/";
        return inversor.rol === "admin" ? "/admin/inversores" : "/mercado";
    };

    return (
        <>
            <nav className="relative bg-gray-200">
                <div className="container px-6 py-6 mx-auto md:flex md:justify-between md:items-center">

                    <div className="flex items-center justify-between">
                        <Link href="/">
                            <img className="w-20 cursor-pointer" src="/logo-simulador.png" alt="Logo Simulador de Inversiones" />
                        </Link>

                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="text-gray-500 dark:text-gray-600 hover:text-gray-800 dark:hover:text-gray-400 focus:outline-none"
                                aria-label="toggle menu"
                            >
                                {!isOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`
                        absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-gray-200
                        md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:flex md:items-center
                        ${isOpen ? 'translate-x-0 opacity-100 block' : '-translate-x-full opacity-0 hidden md:flex md:opacity-100 md:translate-x-0'}
                    `}>
                        <div className="flex flex-col md:flex-row md:mx-6">

                            {/* ⏳ Mientras verifica la sesión, dejamos un esqueleto o espacio vacío para evitar saltos visuales */}
                            {loading ? (
                                <span className="my-2 text-mark font-semibold text-gray-400 md:mx-4 md:my-0">Cargando...</span>
                            ) : inversor ? (                                
                                <>
                                    <Link
                                        href={obtenerRutaSimulador()}
                                        className="my-2 text-mark font-semibold text-blue-600 transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Ir al Simulador
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="my-2 text-mark font-semibold text-red-600 text-left transition-colors duration-300 transform hover:text-red-500 md:mx-4 md:my-0 cursor-pointer"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="my-2 text-mark font-semibold transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="my-2 text-mark font-semibold transition-colors duration-300 transform hover:text-blue-500 md:mx-4 md:my-0"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Registro
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </nav>
        </>
    );
}