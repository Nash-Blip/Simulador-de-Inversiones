'use client';
import { SyntheticEvent, useState, useEffect } from 'react';
import { Activo } from '@/types/index';
import { GetActivo, ModificarActivo } from '@/service/AdminActivo.service';

export default function ModificarActivoPage() {
    const [activos, setActivos] = useState<Activo[]>([]);
    const [activoSeleccionado, setActivoSeleccionado] = useState<Activo | null>(null);
    const [nombre, setNombre] = useState('');
    const [ticker, setTicker] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchActivos = async () => {
            try {
                const data = await GetActivo();
                setActivos(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchActivos();
    }, []);

    function handleSelect(activo: Activo) {
        setActivoSeleccionado(activo);
        setNombre(activo.nombre);
        setTicker(activo.ticker);
        setMessage('');
    }

    function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        const fetchModificar = async () => {
            try {
                await ModificarActivo(activoSeleccionado!.id, nombre, ticker);
                setMessage('Activo modificado con éxito.');
            } catch (err: any) {
                setMessage(err.message || 'Error al modificar el activo');
            }
        }
        fetchModificar();
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
                    Modificar Activo
                </h1>
                <div className="flex items-center justify-center mb-6">
                    <a href="/admin/activos/nuevo"
                        className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b border-gray-400">
                        Crear
                    </a>
                    <a href="/admin/activos/modificar"
                        className="w-1/3 pb-4 font-medium text-center text-white capitalize border-b-2 border-blue-400">
                        Modificar
                    </a>
                </div>
                <div className="w-full bg-[#0b0f19] rounded-xl border-2 p-6">
                    <div className="flex flex-col gap-1 mb-4">
                        <label className="text-sm text-gray-400 uppercase tracking-wider">Seleccionar activo</label>
                        <select
                            className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                            onChange={(e) => {
                                const activo = activos.find(a => a.id === Number(e.target.value));
                                if (activo) handleSelect(activo);
                            }}
                            defaultValue=""
                        >
                            <option value="" disabled>Seleccioná un activo</option>
                            {activos.map((activo) => (
                                <option key={activo.id} value={activo.id}>{activo.ticker} - {activo.nombre}</option>
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
                                <div className={`text-xs p-2 rounded-lg text-center font-medium animate-pulse ${message.includes('éxito') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
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