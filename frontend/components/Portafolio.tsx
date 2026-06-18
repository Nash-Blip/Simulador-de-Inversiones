'use client';

import { useEffect, useState, useCallback } from "react";
import { Activo, Portafolio } from "@/types/index";
import { ActivoTenencia } from "@/components/ActivoTenencia";

let timerVenta: NodeJS.Timeout;

export default function PortafolioComp() {
    const [portafolio, setPortafolio] = useState<Portafolio | null>(null);

    const [ventaExitosa, setVentaExitosa] = useState(false);
    const [activoVentaTicker, setActivoVentaTicker] = useState("");

    const fetchInversor = useCallback(async () => {
        const response = await fetch("http://localhost:3000/inversor/portafolio", {
            method: 'GET',
            credentials: "include",
        });
        const data = await response.json();

        if (response.ok && data) {
            if (data.tenencias && Array.isArray(data.tenencias)) {
                data.tenencias.sort((a: any, b: any) =>
                    a.activo.ticker.localeCompare(b.activo.ticker)
                );
            }
            setPortafolio(data);
        }
    }, []);

    useEffect(() => {
        fetchInversor();

        return () => {
            if (timerVenta) clearTimeout(timerVenta);
        };
    }, [fetchInversor]);

    function handleVender(vender: Activo, cant: number) {
        const fetchVenta = async () => {
            const response = await fetch("http://localhost:3000/activo/vender", {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activoId: vender.id, cantidad: cant })
            });

            if (response.ok) {
                setActivoVentaTicker(vender.ticker);
                setVentaExitosa(true);

                await fetchInversor();

                if (timerVenta) clearTimeout(timerVenta);
                timerVenta = setTimeout(() => {
                    setVentaExitosa(false);
                }, 4000);
            }
        };

        fetchVenta();
    }

    return (
        <div className="p-6 relative min-h-screen">

            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4">
                {ventaExitosa && (
                    <div className="flex w-full overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-bounce-short">
                        <div className="flex items-center justify-center w-12 shrink-0 bg-status-success">
                            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                            </svg>
                        </div>
                        <div className="px-4 py-2 -mx-3">
                            <div className="mx-3">
                                <span className="font-semibold text-status-success">Éxito</span>
                                <p className="text-sm text-gray-600 dark:text-gray-200">
                                    ¡Tu orden de venta de <span className="font-bold">{activoVentaTicker}</span> fue procesada!
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {portafolio ? (
                <div className="flex flex-col gap-6">
                    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left border-collapse bg-white dark:bg-zinc-900 ">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-zinc-800 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-center">
                                    <th className="px-6 py-3">Saldo Virtual</th>
                                    <th className="px-6 py-3">Valor Portafolio</th>
                                    <th className="px-6 py-3">Costo Portafolio</th>
                                    <th className="px-6 py-3">Rendimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-base font-medium text-gray-800 dark:text-gray-200 text-center">
                                <tr>
                                    <td className="px-6 py-4 font-bold text-status-success">
                                        ${portafolio.saldoVirtual.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${(portafolio.valorPortafolio).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${(portafolio.costoPortafolio).toFixed(2)}
                                    </td>
                                    <td className={`px-6 py-4 font-bold ${portafolio.rendimientoPortafolio >= 0
                                        ? "text-status-success"
                                        : "text-status-error"
                                        }`}>
                                        {portafolio.rendimientoPortafolio}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        {portafolio.tenencias.map((tenencia) => (
                            <ActivoTenencia
                                key={tenencia.activo.id}
                                tenencia={tenencia}
                                onVender={handleVender}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">Cargando...</p>
            )}
        </div>
    );
}