'use client';

import { Activo, Portafolio, TenenciaActivo, Inversor } from '../types/index';
import { useState, useEffect } from 'react';

export default function InversorPage() {
    const [portafolio, setPortafolio] = useState<Portafolio | null>(null);
    const [cantidad, setCantidadVenta] = useState(0);
    const [activoSeleccionado, setActivoSeleccionado] = useState<TenenciaActivo | null>(null);

    useEffect(() => {
        const fetchInversor = async () => {
            const response = await fetch("http://localhost:3000/inversor/portafolio",
                {
                    method: 'GET',
                    credentials: "include",
                });
            const data = await response.json();
            if (response.ok) {
                setPortafolio(data);
            }
        }

        fetchInversor();
    }, []);

    function handleVender(vender: Activo, cant: number) {
        const fetchVenta = async () => {
            const response = await fetch("http://localhost:3000/activo/vender",
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ activoId: vender.id, cantidad: cant })
                });
            if (response.ok) {
                window.location.reload();
            }
        }

        fetchVenta();
    }

    function handleSelect(select: TenenciaActivo) {
        setActivoSeleccionado(select);
    }

    return (
        <div className="min-h-screen bg-gray-800 py-6">
            <div className="flex gap-6 p-6 min-h-screen bg-gray-800 justify-center">
                {portafolio ? (
                    <>
                        <div className="w-2/5 bg-gray-700 rounded-xl border border-green-500 p-6">
                            <h1 className="text-xl font-bold text-white mb-4">Costo del portafolio: {portafolio.costoPortafolio}</h1>
                            <h1 className="text-xl font-bold text-white mb-4">Rendimiento: {portafolio.rendimientoPortafolio}</h1>
                            <h1 className="text-xl font-bold text-white mb-4">Valor del Portafolio {portafolio.valorPortafolio}</h1>
                            <div className="grid grid-cols-3 font-bold text-white mb-4 gap-x-4">
                                <p>Activo</p>
                                <p>Cantidad</p>
                                <p>Precio Compra</p>
                                <p>Precio Actual</p>
                                <p>Rendimiento</p>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {portafolio.tenencias.map((tenencia) => (
                                    <li key={tenencia.id} className="grid grid-cols-3 py-3 px-2 items-center">
                                        <span className="font-medium text-white">{tenencia.activo.nombre}</span>
                                        <span className="font-medium text-white">{tenencia.cantidad}</span>
                                        <span className="font-medium text-white">{tenencia.precioCompra}</span>
                                        <span className="font-medium text-white">{tenencia.activo.precioActual}</span>
                                        <span className="font-medium text-white">{tenencia.rendimiento}</span>
                                        <button onClick={() => handleSelect(tenencia)}
                                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 px-4 rounded-lg transition-colors cursor-pointer text-sm">
                                            Vender
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {activoSeleccionado && (
                            <div className="w-1/5 bg-gray-700 rounded-xl border border-green-500 p-6">
                                <h2 className="text-xl font-bold text-white mb-4">{activoSeleccionado.activo.nombre}</h2>
                                <form onSubmit={(e) => { e.preventDefault(); handleVender(activoSeleccionado.activo, cantidad) }}
                                    className="flex flex-col gap-4">
                                    <input
                                        className="bg-gray-500 rounded-xl shadow p-2"
                                        type="text"
                                        placeholder="Cantidad"
                                        value={cantidad === 0 ? '' : cantidad}
                                        onChange={(e) => {
                                            const valor = e.target.value.replace(/\D/g, '');
                                            setCantidadVenta(Number(valor));
                                        }}
                                    />
                                    <button className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                                        type="submit">Confirmar venta
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-white">Cargando...</p>
                )}
            </div>
        </div>
    );
}