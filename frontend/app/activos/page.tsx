"use client";
import { useState, useEffect } from 'react';
import { Activo } from "../types/index"

export default function ActivosPage() {
    const [activos, setActivos] = useState<Activo[]>([]);
    const [activoSeleccionado, setActivoSeleccionado] = useState<Activo | null>(null);
    const [cantidad, setCantidadCompra] = useState(0);
    const [mostrarCompra, setMostrarCompra] = useState(false);

    useEffect(() => {
        const fetchActivos = async () => {
            const response = await fetch("http://localhost:3000/activo", {
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setActivos(data);
            }
        }
        fetchActivos();
    }, []);

    function handleSelect(select: Activo) {
        setActivoSeleccionado(select);
        setMostrarCompra(false);
    }

    function handleComprar(comprar: Activo, cant: number) {
        const fetchComprar = async () => {
            const response = await fetch("http://localhost:3000/activo/comprar",
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({ activoid: comprar.id, cantidad: cant }),
                    credentials: 'include'
                });
            if (response.ok) {
                setCantidadCompra(0);
            }
        }
        fetchComprar();
    }

    return (
        <div className="min-h-screen bg-gray-800 py-6">
            <div className="flex gap-6 p-6 min-h-screen bg-gray-800 justify-center">
                <div className="w-2/5 bg-gray-700 rounded-xl border border-green-500 p-6">
                    <h1 className="text-xl font-bold text-white-800 mb-4">Listado de Activos</h1>
                    <div className="grid grid-cols-3 font-bold text-white-800 mb-4 gap-x-4">
                        <p>Nombre</p>
                        <p>Ticker</p>
                        <p>Precio</p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {activos.map((activo) => (
                            <li key={activo.id} onClick={() => handleSelect(activo)} className="grid grid-cols-3 py-3 px-2 cursor-pointer">
                                <span className="font-medium text-white-800">{activo.nombre}</span>
                                <span className="text-sm text-white-500">{activo.ticker}</span>
                                <span className="text-green-600 font-semibold">${activo.precioActual}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {activoSeleccionado && (
                    <div className="w-1/5 bg-gray-700 rounded-xl border border-green-500 p-6">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-white">{activoSeleccionado.nombre}</h2>
                            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm w-fit">{activoSeleccionado.ticker}</span>
                            <p className="text-2xl font-bold text-green-600">${activoSeleccionado.precioActual}</p>
                            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer" onClick={() => setMostrarCompra(true)}>Comprar</button>
                            {mostrarCompra ? (
                                <form onSubmit={(e) => { e.preventDefault(); handleComprar(activoSeleccionado, cantidad) }}>
                                    <input className="bg-gray-500 rounded-xl shadow p-2" id="cantidad" type="number" value={cantidad === 0 ? '' : cantidad} onChange={(e) => setCantidadCompra(Number(e.target.value))} />
                                    <label htmlFor="cantidad">Cantidad</label>
                                    <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer" type="submit">Confirmar</button>
                                </form>
                            ) : ( null )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}