"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Inversor } from "../types/index";
import { logout } from '@/service/Auth.service';
import { getInversor } from '@/service/Inversor.service';

export default function AppBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const [inversor, setInversor] = useState<Inversor | null>(null);
    const [loading, setLoading] = useState(true);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                const perfil = await getInversor()
                setInversor(perfil);
            } catch (error) {
                console.error("Error al obtener el perfil:", error);
                window.location.replace('/');
            } finally {
                setLoading(false);
            }
        };

        obtenerPerfil();
    }, [router]);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuItems = [
        { name: "Mercado", href: "/mercado", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z" clipRule="evenodd" /></svg>) },
        { name: "Portafolio", href: "/portafolio", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /><path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" /></svg>) },
        { name: "Transacciones", href: "/transacciones", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" /></svg>) },
        { name: "Fondos", href: "/fondos", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /><path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" /><path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" /></svg>) },
        { name: "Ajustes", href: "/ajustes", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6"><path fillRule="evenodd" d="M11.078 2.25c-.424 0-.793.293-.896.705l-.347 1.407a8.958 8.958 0 0 0-1.873 1.082l-1.332-.524a.914.914 0 0 0-1.037.29l-1.484 2.571a.914.914 0 0 0 .227 1.137l1.114.887c-.05.316-.075.642-.075.974 0 .332.025.658.075.974l-1.114.887a.914.914 0 0 0-.227 1.137l1.484 2.571c.252.437.77.635 1.037.29l1.332-.524c.557.43 1.187.794 1.873 1.082l.347 1.407c.103.412.472.705.896.705h2.969c.424 0 .793-.293.896-.705l.347-1.407a8.958 8.958 0 0 0 1.873-1.082l1.332.524c.268.105.584 0 .1-.29l1.484-2.571a.914.914 0 0 0-.227-1.137l-1.114-.887c.05-.316.075-.642.075-.974 0-.332-.025-.658-.075-.974l1.114-.887a.914.914 0 0 0 .227-1.137l-1.484-2.571a.914.914 0 0 0-1.037-.29l-1.332.524a8.958 8.958 0 0 0-1.873-1.082l-.347-1.407a.914.914 0 0 0-.896-.705h-2.969ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clipRule="evenodd" /></svg>) },
    ];

    const handleLogout = async () => {
        try {
            await logout();
            window.location.replace('/');
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
            setErrorMessage("No se pudo conectar con el servidor.");
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
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0-5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"></path>
                </svg>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed md:sticky top-0 left-0 z-40 flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}>

                <Link href="/">
                    <img className="w-auto h-6 sm:h-7 mx-auto" src="/logo-simulador.png" alt="Logo Simulador de inversiones" />
                </Link>

                <div className="flex flex-col items-center mt-8 mb-2 -mx-2">
                    <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                        {inversor ? `${inversor.nombre[0]}` : "U"}
                    </div>
                    {loading ? (
                        <p className="text-sm text-gray-500 animate-pulse mt-2">Cargando usuario...</p>
                    ) : (
                        <>
                            <h4 className="mx-2 mt-4 font-medium text-gray-800 dark:text-gray-200">
                                {inversor?.nombre || "Usuario"}
                            </h4>
                        </>
                    )}
                </div>

                <div className="flex flex-col justify-between flex-1 mt-6">
                    <nav className="space-y-4">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 transition-colors duration-300 transform rounded-md ${isActive
                                        ? "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                                        }`}
                                >
                                    {item.icon}
                                    <span className="mx-4 font-medium">{item.name}</span>
                                </Link>
                            );
                        })}

                        <hr className="my-6 border-gray-200 dark:border-gray-600" />

                        {errorMessage && (
                            <p className="text-xs text-red-500 text-center mb-2 font-semibold">{errorMessage}</p>
                        )}

                        <button
                            onClick={handleLogout}
                            type="button"
                            className="flex items-center w-full px-4 py-2 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700 text-left cursor-pointer"
                        >
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