"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Perfil } from '@/types/index';
import { getPerfil } from "@/service/Inversor.service";
import { logout } from '@/service/Auth.service';

export default function AppBarAdmin() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [perfil, setPerfil] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(true);

    const menuItems = [
        {
            name: "Inversores", href: "/admin/inversores", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: "Crear Activo", href: "/admin/activos", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
            )
        },
        {
            name: "Transacciones", href: "/admin/transacciones", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                </svg>
            )
        },
    ];

    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                const perfil = await getPerfil();
                setPerfil(perfil);
            } catch {
                window.location.href = '/auth/login';
            } finally {
                setLoading(false);
            }
        };
        obtenerPerfil();
    }, [router]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try{
            await logout();
            window.location.href = '/';  
        }catch(err){
            console.log(err);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 fixed top-2 left-2 z-50 cursor-pointer"
            >
                <span className="sr-only">Abrir menú</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0-5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setIsOpen(false)} />
            )}

            <aside className={`fixed md:sticky top-0 left-0 z-40 flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

                <Link href="/admin">
                    <img className="w-auto h-6 sm:h-7 mx-auto" src="/logo-simulador.png" alt="Logo Simulador de inversiones" />
                </Link>

                <div className="flex flex-col items-center mt-8 mb-2 -mx-2">
                    <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                        {perfil ? perfil.nombre[0] : "A"}
                    </div>
                    {loading ? (
                        <p className="text-sm text-gray-500 animate-pulse mt-2">Cargando usuario...</p>
                    ) : (
                        <h4 className="mx-2 mt-4 font-medium text-gray-800 dark:text-gray-200">
                            {perfil?.nombre || "Admin"}
                        </h4>
                    )}
                </div>

                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav className="space-y-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link key={item.href} href={item.href}
                                    className={`flex items-center px-4 py-2 transition-colors duration-300 transform rounded-md ${isActive ? "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-200" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"}`}>
                                    {item.icon}
                                    <span className="mx-4 font-medium">{item.name}</span>
                                </Link>
                            );
                        })}

                        <hr className="my-6 border-gray-200 dark:border-gray-600" />

                        <button onClick={handleLogout} type="button"
                            className="flex items-center w-full px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 text-left cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                            </svg>
                            <span className="mx-4 font-medium text-red-500">Logout</span>
                        </button>
                    </nav>
                </div>
            </aside>
        </>
    );
}