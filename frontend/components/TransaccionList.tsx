"use client";

import { useEffect, useState } from 'react';
import { TransaccionHistorial } from '@/types';

export default function TransaccionList() {
    const [transacciones, setTransacciones] = useState<TransaccionHistorial[]>([]);

    useEffect(() => {
        const fetchTransacciones = async () => {
            const response = await fetch("http://localhost:3000/transaccion/historial", {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setTransacciones(data.data);
            }
        }
        fetchTransacciones();
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
                Historial de Transacciones
            </h1>
            <div className="w-full max-w-6xl mx-auto bg-[#0b0f19] rounded-xl border-2 p-4 md:p-6 overflow-x-auto">
                <table className="w-full text-center border-collapse min-w-[175]">
                    <thead>
                        <tr className="font-bold text-white border-b border-gray-800">
                            <th className="pb-4 px-2 text-left">Tipo</th>
                            <th className="pb-4 px-2">Ticker</th>
                            <th className="pb-4 px-2">Cantidad</th>
                            <th className="pb-4 px-2">Precio Ejecutado</th>
                            <th className="pb-4 px-2">Monto Total</th>
                            <th className="pb-4 px-2">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {transacciones.map((transaccion) => {
                            const esEntrada = transaccion.tipoTransaccion.toString().toLowerCase() === "compra";
                            const precioOperado = transaccion.precioEjecutado / transaccion.cantidad;
                            const colorTipo = esEntrada ? "text-status-success" : "text-status-error";

                            return (
                                <tr key={transaccion.id} className="hover:bg-gray-900/50 transition-colors">

                                    <td className="py-4 px-2 text-left">
                                        <span className={`font-bold uppercase text-xs tracking-wider px-2.5 py-1 rounded-md bg-gray-900/60 border border-gray-800 ${colorTipo}`}>
                                            {transaccion.tipoTransaccion}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2">
                                        <strong className="text-blue-400 font-semibold">{transaccion.ticker}</strong>
                                    </td>
                                    <td className="py-4 px-2 text-white font-medium">
                                        {transaccion.cantidad}
                                    </td>
                                    <td className="py-4 px-2 text-gray-300">
                                        ${precioOperado.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-2 text-white font-semibold">
                                        ${transaccion.precioEjecutado.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-2 text-gray-400 text-sm">
                                        {new Date(transaccion.fecha).toLocaleDateString("es-ES")}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {transacciones.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No se encontraron transacciones en tu historial.
                    </div>
                )}
            </div>
        </div>
    );
}