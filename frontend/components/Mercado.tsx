"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Activo, Inversor } from "@/types";
import { comprarActivo, getActivosPaginados, getListActivos } from "@/service/Activo.service";
import { getInversor } from "@/service/Inversor.service";

const GraficoActivo = dynamic(() => import("./GraficoActivo"), {
    ssr: false,
    loading: () => <div className="h-44 bg-gray-900/60 animate-pulse rounded-xl mt-1 border border-gray-700" />
});

let timerExito: NodeJS.Timeout;
let timerError: NodeJS.Timeout;

export default function Mercado() {
    const [activos, setActivos] = useState<Activo[]>([]);
    const [activoSeleccionado, setActivoSeleccionado] = useState<Activo | null>(null);

    const [cantidad, setCantidadCompra] = useState<number | "">(1);
    const [mostrarCompra, setMostrarCompra] = useState(false);

    const [compraExitosa, setCompraExitosa] = useState(false);
    const [errorSaldo, setErrorSaldo] = useState(false);

    const [activoExitoTicker, setActivoExitoTicker] = useState("");
    const [activoErrorTicker, setActivoErrorTicker] = useState("");

    const [inversor, setInversor] = useState<Inversor | null>(null);
    const [maximoCompra, setMaximoCompra] = useState(0);

    const [pagina, setPagina] = useState<number>(1);
    const [totalPaginas, setTotalPaginas] = useState<number>(1);
    const [search, setSearch] = useState("");

    const fetchActivos = useCallback(async () => {
        try {
            const json = await getActivosPaginados(pagina, search);
            console.log(json);
            setActivos(json.data);
            setTotalPaginas(json.meta.totalPages);


            setActivoSeleccionado((prev) => {
                if (!prev) return null;
                const actualizado = json.data.find((a: Activo) => a.id === prev.id);
                return actualizado ? actualizado : prev;
            });
        } catch (error) {
            console.error("Error fetching activos:", error);
        }
    }, [pagina, search]);

    const fetchInversor = async () => {
        try {
            const data = await getInversor();
            setInversor(data);
        } catch (error) {
            console.error("Error al cargar histórico del activo:", error);
        }
    };

    useEffect(() => {
        fetchActivos();
        fetchInversor();

        const interval = setInterval(() => {
            fetchActivos();
        }, 3000);

        return () => clearInterval(interval);
    }, [fetchActivos]);

    useEffect(() => {
        setPagina(1);
    }, [search]);

    function handleSelect(select: Activo) {
        setActivoSeleccionado(select);
        setMostrarCompra(true);
        setCantidadCompra(1);
    }

    function handleComprar(comprar: Activo, cant: number | "") {
        if (cant === "" || cant < 1) return;

        const fetchComprar = async () => {
            try {
                await comprarActivo(comprar.id, cant);

                setCantidadCompra(1);
                setMostrarCompra(false);
                setActivoSeleccionado(null);

                setActivoExitoTicker(comprar.ticker);
                setCompraExitosa(true);

                await fetchInversor();

                if (timerExito) clearTimeout(timerExito);
                timerExito = setTimeout(() => {
                    setCompraExitosa(false);
                }, 4000);
            } catch {
                setActivoErrorTicker(comprar.ticker);
                setErrorSaldo(true);

                if (timerError) clearTimeout(timerError);
                timerError = setTimeout(() => {
                    setErrorSaldo(false);
                }, 4000);
            }

        }
        fetchComprar();
    };


    return (
        <div className="min-h-screen bg-[#0b0f19] py-6 px-4">

            {/* Toasts / Notificaciones */}
            <div className="fixed left-1/2 -translate-x-1/2 md:left-72 md:translate-x-0 z-50 flex flex-col gap-3 max-w-sm w-full px-4">
                {compraExitosa && (
                    <div className="flex w-full overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 animate-bounce-short">
                        <div className="flex items-center justify-center w-12 shrink-0 bg-status-success">
                            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                            </svg>
                        </div>
                        <div className="px-4 py-2 -mx-3">
                            <div className="mx-3">
                                <span className="font-semibold text-status-success">Éxito</span>
                                <p className="text-sm text-gray-600 dark:text-gray-200">
                                    ¡Tu orden de compra de <span className="font-bold">{activoExitoTicker}</span> fue procesada!
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {errorSaldo && (
                    <div className="flex w-full overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 animate-bounce-short">
                        <div className="flex items-center justify-center w-12 shrink-0 bg-status-error">
                            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                            </svg>
                        </div>
                        <div className="px-4 py-2 -mx-3">
                            <div className="mx-3">
                                <span className="font-semibold text-status-error">Error</span>
                                <p className="text-sm text-gray-600 dark:text-gray-200">
                                    No tenés saldo suficiente para comprar <span className="font-bold">{activoErrorTicker}</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">Mercado</h1>

            <div className="w-full max-w-6xl mx-auto mb-4">
                <input
                    type="text"
                    placeholder="Buscar por nombre o ticker..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    maxLength={25}
                    className="w-full sm:w-64 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            <div className={`w-full max-w-6xl mx-auto grid grid-cols-1 gap-6 transition-all duration-300 ${activoSeleccionado ? "lg:grid-cols-[1fr_384px]" : "lg:grid-cols-1"}`}>

                {/* Tabla de Activos */}
                <div className="w-full bg-[#0b0f19] rounded-xl border-2 p-4 md:p-6 overflow-x-auto">
                    <table className="w-full text-center border-collapse min-w-[175px]">
                        <thead>
                            <tr className="font-bold text-white border-b border-gray-800">
                                <th className="pb-4 px-2 text-left">Ticker / Nombre</th>
                                <th className="pb-4 px-2">Precio</th>
                                <th className="pb-4 px-2">Anterior</th>
                                <th className="pb-4 px-2">P. Max</th>
                                <th className="pb-4 px-2">P. Min</th>
                                <th className="pb-4 px-2">Rendimiento</th>
                                <th className="pb-4 px-2">Operaciones</th>
                                <th className="pb-4 px-2">Total Ej.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {activos.map((activo) => {
                                const esMayor = activo.precioActual > activo.precioInicial;
                                const esMenor = activo.precioActual < activo.precioInicial;

                                const colorPrecio = esMayor ? "text-status-success" : esMenor ? "text-status-error" : "text-gray-300";
                                const colorRendimiento = esMayor ? "text-status-success" : esMenor ? "text-status-error" : "text-gray-300";
                                const rendimiento = ((activo.precioActual / activo.precioInicial - 1) * 100).toFixed(2);

                                return (
                                    <tr key={activo.id} className="hover:bg-gray-900/50 transition-colors">
                                        <td className="py-4 px-2 text-left">
                                            <span
                                                className="font-medium text-white hover:underline cursor-pointer block"
                                                onClick={() => handleSelect(activo)}
                                            >
                                                <strong className="text-blue-400">{activo.ticker}</strong>
                                                <span className="text-xs text-gray-400 block mt-0.5">{activo.nombre}</span>
                                            </span>
                                        </td>
                                        <td className={`py-4 px-2 font-semibold ${colorPrecio}`}>
                                            ${activo.precioActual.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-2 text-bg-light">${activo.precioInicial.toFixed(2)}</td>
                                        <td className="py-4 px-2 text-bg-light">${activo.valorMaximo.toFixed(2)}</td>
                                        <td className="py-4 px-2 text-bg-light">${activo.valorMinimo.toFixed(2)}</td>
                                        <td className={`py-4 px-2 font-semibold ${colorRendimiento}`}>
                                            {esMayor ? "+" : ""}{rendimiento}%
                                        </td>
                                        <td className="py-4 px-2 text-bg-light">{activo.cantOperaciones}</td>
                                        <td className="py-4 px-2 text-bg-light">${activo.totalEjecutado.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {activos.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {search
                                ? `No se encontraron activos que coincidan con "${search}".`
                                : "No hay activos disponibles."
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
                            <span className="text-sm text-gray-400 font-medium">Página {pagina} de {totalPaginas}</span>
                            <button
                                onClick={() => setPagina((prev) => prev + 1)}
                                disabled={pagina >= totalPaginas}
                                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md border border-gray-800 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 cursor-pointer transition-colors font-medium"
                            >
                                Siguiente →
                            </button>
                        </div>
                    )}
                </div>

                {/* Panel Lateral de Compra */}
                {activoSeleccionado && (
                    <div className="w-full lg:h-full lg:min-h-[400px] lg:relative">
                        <div className="w-full max-w-md mx-auto bg-gray-800 rounded-xl border border-white p-6 shadow-2xl mt-6 lg:mt-0 lg:fixed lg:w-[420px] lg:top-[110px]  max-h-[calc(100vh-140px)] overflow-y-auto z-40">
                            <button
                                onClick={() => setActivoSeleccionado(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-semibold transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-600 w-8 h-8 flex items-center justify-center"
                                aria-label="Cerrar ventana"
                            >
                                ✕
                            </button>

                            <div className="flex flex-col gap-4">
                                <h2 className="text-xl font-bold text-white pr-6">{activoSeleccionado.nombre}</h2>
                                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm w-fit font-bold border border-gray-700">
                                    {activoSeleccionado.ticker}
                                </span>

                                <div className="text-gray-300 text-sm">
                                    Saldo disponible: <span className="font-bold text-white">${inversor?.saldo.toFixed(2) ?? '0.00'}</span>
                                </div>

                                <div className="flex flex-col gap-1 my-1">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider pl-1">Evolución del Activo</p>
                                    <GraficoActivo
                                        id={activoSeleccionado.id}
                                        ticker={activoSeleccionado.ticker}
                                        precioActual={activoSeleccionado.precioActual}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-center my-1">
                                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Precio Actual</p>
                                        <p className="text-xl font-bold text-status-success mt-1">${activoSeleccionado.precioActual.toFixed(2)}</p>
                                    </div>
                                    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">Total Compra</p>
                                        <p className="text-xl font-bold text-status-success mt-1">
                                            ${(activoSeleccionado.precioActual * (cantidad || 0)).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {mostrarCompra && (
                                    <form onSubmit={(e) => { e.preventDefault(); handleComprar(activoSeleccionado, cantidad) }}>
                                        <div className="flex flex-col gap-3 mt-1 items-center">
                                            <label htmlFor="cantidad" className="text-white text-sm font-medium">Cantidad a comprar</label>
                                            <input
                                                className="w-32 text-center bg-gray-700 border-2 border-gray-600 rounded-xl shadow p-2 text-white text-lg font-bold focus:outline-none focus:border-green-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                id="cantidad"
                                                type="number"
                                                min="1"
                                                max="1000"
                                                step="1"
                                                value={cantidad}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    if (inputValue === '') {
                                                        setCantidadCompra('');
                                                        return;
                                                    }
                                                    const val = Math.floor(Number(inputValue));
                                                    if (val >= 1) {
                                                        setCantidadCompra(val);
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (['e', 'E', '.', ',', '-', '+'].includes(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {Number(cantidad) > 1000 && (
                                                <p className="text-xs text-red-500 font-semibold mt-1 animate-fade-in">
                                                    * Supera el máximo permitido por operación (1000 unidades).
                                                </p>
                                            )}
                                            <button
                                                className="mt-2 w-full bg-status-success hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors cursor-pointer text-center shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                type="submit"
                                                disabled={cantidad === '' || cantidad < 1 || cantidad > 1000}
                                            >
                                                Confirmar Compra
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}