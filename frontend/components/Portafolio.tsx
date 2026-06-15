'use client';

import { useEffect, useState, useCallback } from "react";
import { Activo, Portafolio } from "@/types/index";
import { ActivoTenencia } from "@/components/ActivoTenencia";

export default function PortafolioComp() {
    const [portafolio, setPortafolio] = useState<Portafolio | null>(null);

    const fetchInversor = useCallback(async () => {
        const response = await fetch("http://localhost:3000/inversor/portafolio", {
            method: 'GET',
            credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
            setPortafolio(data);
        }
    }, []);

    useEffect(() => {
        fetchInversor();
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
                await fetchInversor(); 
            }
        };

        fetchVenta();
    }

    return (
        <div className="p-6">
            {portafolio ? (
                <div className="flex flex-col gap-6">
                    <div className="overflow-x-auto rounded-xl shadow border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left border-collapse bg-white dark:bg-zinc-900 ">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-zinc-800 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 text-center">
                                    <th className="px-6 py-3">Saldo Virtual</th>
                                    <th className="px-6 py-3">Costo Portafolio</th>
                                    <th className="px-6 py-3">Valor Portafolio</th>
                                    <th className="px-6 py-3">Rendimiento</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-base font-medium text-gray-800 dark:text-gray-200 text-center">
                                <tr>
                                    <td className="px-6 py-4 font-bold text-status-success">
                                        ${portafolio.saldoVirtual}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${(portafolio.costoPortafolio).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        ${(portafolio.valorPortafolio).toFixed(2)}
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