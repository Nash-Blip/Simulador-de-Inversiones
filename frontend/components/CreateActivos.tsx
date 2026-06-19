'use client';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateActivos() {
    const [nombre, setNombre] = useState('');
    const [ticker, setTicker] = useState('');
    const [precioInicial, setPrecioInicial] = useState(0);
    const [message, setMessage] = useState('');
    const router = useRouter();

    function handleSubmit(e: SyntheticEvent) {
        e.preventDefault();

        const fetchCreateActivo = async () => {
            const response = await fetch("http://localhost:3000/activo",
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            nombre,
                            ticker,
                            precioInicial
                        }
                    )
                }
            );

            if (response.ok) {
                setMessage("Activo creado con exito.");
                router.push('/activos');
            }
        }
        fetchCreateActivo();
    }

    function handleReset() {
        setNombre('');
        setTicker('');
        setPrecioInicial(0);
    }

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div className="flex flex-col gap-4 p-6 bg-gray-700 rounded-xl border border-green-600">
                    <h1 className="text-xl font-bold text-white mb-4">Crear Activo</h1>
                    <input
                        className="bg-gray-500 rounded-xl shadow p-2"
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <input
                        className="bg-gray-500 rounded-xl shadow p-2"
                        type="text"
                        placeholder="Ticker"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                    />
                    <input
                        className="bg-gray-500 rounded-xl shadow p-2"
                        type="text"
                        placeholder="Precio inicial"
                        value={precioInicial === 0 ? '' : precioInicial}
                        onChange={(e) => {
                            const valor = e.target.value.replace(/[^0-9.]/g, '');
                            setPrecioInicial(Number(valor));
                        }}
                    />
                    <p className="text-white">{message}</p>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                        type="submit">Crear
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                        type="reset">Restablecer
                    </button>
                </div>
            </form>
        </div>
    );
}