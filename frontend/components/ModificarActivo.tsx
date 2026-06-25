'use client';
import { SyntheticEvent, useState, useEffect, useCallback } from 'react';
import { Activo } from '@/types/index';
import { getActivo, ModificarActivo } from '@/service/Activo.service';
import Link from 'next/link';

export default function ModificarActivoPage() {
    const [activos, setActivos] = useState<Activo[]>([]);
    const [activoSeleccionado, setActivoSeleccionado] = useState<Activo | null>(null);
    const [nombre, setNombre] = useState('');
    const [ticker, setTicker] = useState('');
    const [message, setMessage] = useState('');

    const fetchActivos = useCallback(async () => {
        try {
            const data = await getActivo();
            setActivos(data);
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const initFetch = async () => {
            await fetchActivos();
        };
        initFetch();
    }, [fetchActivos]);

    function handleSelect(activo: Activo) {
        setActivoSeleccionado(activo);
        setNombre(activo.nombre);
        setTicker(activo.ticker);
        setMessage('');
    }

    async function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        if (!activoSeleccionado) return;

        try {
            await ModificarActivo(activoSeleccionado.id, nombre, ticker);
            setMessage('Activo modificado con éxito.');
        
            await fetchActivos(); 
            
            setActivoSeleccionado(null);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Error al modificar el activo');
        }
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
                    Modificar Activo
                </h1>
                <div className="flex items-center justify-center mb-6">
                    <Link href="/admin/activos"
                        className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b border-gray-400">
                        Crear
                    </Link>
                    <Link href="/admin/activos/modificar"
                        className="w-1/3 pb-4 font-medium text-center text-white capitalize border-b-2 border-blue-400">
                        Modificar
                    </Link>
                </div>
                <div className="w-full bg-[#0b0f19] rounded-xl border-2 p-6">
                    <div className="flex flex-col gap-1 mb-4">
                        <label className="text-sm text-gray-400 uppercase tracking-wider">Seleccionar activo</label>
                        <select
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                                const activo = activos.find(a => String(a.id) === e.target.value);
                                if (activo) handleSelect(activo);
                            }}
                            value={activoSeleccionado?.id || ""}
                        >
                            <option value="" disabled>Seleccioná un activo</option>
                            {activos.map((act) => (
                                <option key={act.id} value={act.id}>{act.ticker} - {act.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {activoSeleccionado && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-400 uppercase tracking-wider">Nombre</label>
                                <input
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-gray-400 uppercase tracking-wider">Ticker</label>
                                <input
                                    className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    type="text"
                                    value={ticker}
                                    onChange={(e) => setTicker(e.target.value)}
                                />
                            </div>

                            {message && (
                                <div className={`text-xs p-2 rounded-lg text-center font-medium ${message.includes('éxito') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer mt-2"
                                type="submit">
                                Modificar activo
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}