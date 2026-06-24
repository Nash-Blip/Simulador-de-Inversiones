"use client";

import { useEffect, useState } from 'react';
import { TransaccionHistorial } from '@/types';
import { getTransacciones, getUserTransacciones } from '@/service/ListTransacciones.service';

export default function TransaccionList() {
    const [transacciones, setTransacciones] = useState<TransaccionHistorial[]>([]);
    const [pagina, setPagina] = useState<number>(1);
    const [tipoFiltro, setTipoFiltro] = useState<string>("TODOS");
    const [search, setSearch] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [cargando, setCargando] = useState<boolean>(true);
    const [totalPaginas, setTotalPaginas] = useState<number>(1);

    useEffect(() => {
        setPagina(1);
    }, [search, fechaInicio, fechaFin]);

    useEffect(() => {
        const fetchTransacciones = async () => {
            setCargando(true);
            try {
                const data = await getUserTransacciones(pagina, tipoFiltro, search, fechaInicio || undefined, fechaFin || undefined);
                setTransacciones(Array.isArray(data.data) ? data.data : []);
                if(data.meta){
                    setTotalPaginas(data.meta.totalPages || 1);
                }
            } catch (error) {
                console.error("Error al buscar transacciones:", error);
            } finally {
                setCargando(false);
            }
        };
        fetchTransacciones();
    }, [pagina, tipoFiltro, search, fechaInicio, fechaFin]);

    const handleFiltroChange = (nuevoFiltro: string) => {
        setTipoFiltro(nuevoFiltro);
        setPagina(1);
    };

    const tienePaginaSiguiente = pagina < totalPaginas;

    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4">
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">
                Historial de Transacciones
            </h1>

            <div className="w-full max-w-6xl mx-auto mb-4 flex flex-col sm:flex-row items-end gap-4 flex-wrap justify-between">
                <div className="flex items-end gap-4 flex-wrap">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o ticker..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        maxLength={25}
                        className="w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <div className="flex items-end gap-2">
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-0.5">Fecha Inicio</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xs text-gray-400 mb-0.5">Fecha Fin</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="w-40 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex bg-gray-900/60 p-1 rounded-lg border border-gray-800">
                    {["TODOS", "COMPRA", "VENTA"].map((tipo) => (
                        <button
                            key={tipo}
                            onClick={() => handleFiltroChange(tipo)}
                            className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-colors cursor-pointer ${tipoFiltro === tipo
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-400 hover:text-white"
                                }`}
                        >{tipo}</button>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-6xl mx-auto bg-[#0b0f19] rounded-xl border-2 p-4 md:p-6 overflow-x-auto">
                {cargando ? (
                    <div className="text-center py-20 text-gray-400 animate-pulse">
                        Cargando historial...
                    </div>
                ) : (
                    <>
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
                                {search
                                    ? `No se encontraron transacciones que coincidan con "${search}".`
                                    : "No se encontraron transacciones en tu historial."
                                }
                            </div>
                        )}

                        {totalPaginas > 1 && (
                            <div className="flex justify-center items-center gap-6 mt-6 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                                    disabled={pagina === 1}
                                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 cursor-pointer transition-colors font-medium"
                                >
                                    ← Anterior
                                </button>

                                <span className="text-sm text-gray-400 font-medium">
                                    Página {pagina} de {totalPaginas}
                                </span>

                                <button
                                    onClick={() => setPagina((prev) => prev + 1)}
                                    disabled={!tienePaginaSiguiente}
                                    className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 cursor-pointer transition-colors font-medium"
                                >
                                    Siguiente →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}