'use client';
import { useEffect, useState } from 'react';
import { TransaccionHistorial } from '@/types/index';

export default function ListTransacciones() {
    const [transacciones, setTransacciones] = useState<TransaccionHistorial[]>([]);

    useEffect(() => {
        const fetchTransacciones = async () => {
            const response = await fetch("http://localhost:3000/transaccion",
                {
                    credentials: 'include'
                }
            );
            const data = await response.json();
            console.log(data.data);
            if (response.ok) {
                setTransacciones(data.data);
            }
        }
        fetchTransacciones();
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 py-6">
            <div className="flex gap-6 p-6 justify-center">
                <div className="w-4/5 bg-gray-700 rounded-xl border border-green-500 p-6">
                    <h1 className="text-xl font-bold text-white mb-4">Listado de Transacciones</h1>
                    <div className="grid grid-cols-5 font-bold text-white mb-4 gap-x-4">
                        <p>Tipo</p>
                        <p>Ticker</p>
                        <p>Cantidad</p>
                        <p>Precio Ejecutado</p>
                        <p>Fecha</p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {transacciones.map((transaccion) => (
                            <li key={transaccion.id} className="grid grid-cols-5 py-3 px-2">
                                <span className="text-white">{transaccion.tipoTransaccion}</span>
                                <span className="text-white">{transaccion.ticker}</span>
                                <span className="text-green-600 font-semibold">{transaccion.cantidad}</span>
                                <span className="text-green-600 font-semibold">${transaccion.precioEjecutado}</span>
                                <span className="text-white">{new Date(transaccion.fecha).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}