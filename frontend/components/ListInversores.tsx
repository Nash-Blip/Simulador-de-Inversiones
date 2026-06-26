'use client';
import { useEffect, useState } from 'react';
import { Inversor } from '@/types/index';
import { getInversores } from '@/service/ListInversores.service';

export default function ListInversores() {
    const [inversores, setInversores] = useState<Inversor[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setCargando(true);
            try {
                const data = await getInversores();
                setInversores(data);
            } catch (err) {
                console.error(err);
            } finally {
                setCargando(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
                Listado de Inversores
            </h1>

            <div className="w-full max-w-6xl mx-auto bg-[#0b0f19] rounded-xl border-2 p-4 md:p-6 overflow-x-auto">
                {cargando ? (
                    <div className="text-center py-20 text-gray-400 animate-pulse">Cargando...</div>
                ) : (
                    <>
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="font-bold text-white border-b border-gray-800">
                                    <th className="pb-4 px-2 text-left">Nombre</th>
                                    <th className="pb-4 px-2">Email</th>
                                    <th className="pb-4 px-2">Rol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {inversores.map((inversor) => (
                                    <tr key={inversor.id} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="py-4 px-2 text-left">
                                            <span className="font-medium text-white">{inversor.nombre}</span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="text-gray-400 text-sm">{inversor.email}</span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`font-bold uppercase text-xs tracking-wider px-2.5 py-1 rounded-md bg-gray-900/60 border border-gray-800 ${inversor.rol === 'admin' ? 'text-blue-400' : 'text-green-400'}`}>
                                                {inversor.rol}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {inversores.length === 0 && (
                            <div className="text-center py-12 text-gray-500">No hay inversores registrados.</div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}