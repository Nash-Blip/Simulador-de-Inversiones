'use client';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateActivo } from '@/service/AdminActivo.service';

export default function CreateActivos() {
    const [nombre, setNombre] = useState('');
    const [ticker, setTicker] = useState('');
    const [precioInicial, setPrecioInicial] = useState(0);
    const [message, setMessage] = useState('');
    const router = useRouter();

    function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();
        const fetchCreateActivo = async () => {
            try {
                await CreateActivo(nombre, ticker, precioInicial);
                setMessage("Activo creado con éxito.");
                router.push('/admin/transacciones');
            } catch (err) {
                setMessage(err instanceof Error ? err.message : 'Error al crear el activo');
            }
        }
        fetchCreateActivo();
    }

    function handleReset() {
        setNombre('');
        setTicker('');
        setPrecioInicial(0);
        setMessage('');
    }

    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4 flex items-center justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
                    Crear Activo
                </h1>
                <div className="flex items-center justify-center mb-6">
                    <a href="/admin/activos/nuevo"
                        className="w-1/3 pb-4 font-medium text-center text-white capitalize border-b-2 border-blue-400">
                        Crear
                    </a>
                    <a href="/admin/activos/modificar"
                        className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b border-gray-400">
                        Modificar
                    </a>
                </div>
                <div className="w-full bg-[#0b0f19] rounded-xl border-2 p-6">
                    <form onSubmit={handleSubmit} onReset={handleReset} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400 uppercase tracking-wider">Nombre</label>
                            <input
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                type="text"
                                placeholder="Ej: Apple Inc."
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400 uppercase tracking-wider">Ticker</label>
                            <input
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                type="text"
                                placeholder="Ej: AAPL"
                                value={ticker}
                                onChange={(e) => setTicker(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-400 uppercase tracking-wider">Precio inicial</label>
                            <input
                                className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                type="text"
                                placeholder="Ej: 150.00"
                                value={precioInicial === 0 ? '' : precioInicial}
                                onChange={(e) => {
                                    const valor = e.target.value.replace(/[^0-9.]/g, '');
                                    setPrecioInicial(Number(valor));
                                }}
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
                            Crear activo
                        </button>
                        <button
                            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer"
                            type="reset">
                            Restablecer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}