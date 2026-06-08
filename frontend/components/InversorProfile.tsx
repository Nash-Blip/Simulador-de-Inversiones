'use client';

import { Activo, Portafolio } from '../types/index';
import { useState, useEffect } from 'react';

export default function InversorPage() {
    const [portafolio, setPortafolio] = useState<Portafolio | null>(null);
    const [cantidad, setCantidadVenta] = useState(0);
    
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
            if(response.ok){
                window.location.reload();
            }
        }

        fetchVenta();
    }

    return (
        <div>
            {portafolio ? (
                <div>
                    <p>Valor del portafolio: {portafolio.valorPortafolio}</p>
                    <div className="grid grid-cols-2">
                        <p>Activo</p>
                        <p>Cantidad</p>
                    </div>
                    {portafolio.tenencias.map((tenencia) => (
                        <div key={tenencia.id} className="grid grid-cols-2">
                            <span>{tenencia.activo.nombre}</span>
                            <span>{tenencia.cantidad}</span>
                            <input className="bg-gray-500 rounded-xl shadow p-2" id="cantidad" type="number" value={cantidad === 0 ? '' : cantidad} onChange={(e) => setCantidadVenta(Number(e.target.value))}/>
                            <label htmlFor="cantidad">Cantidad</label>
                            <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer" onClick={() => handleVender(tenencia.activo, cantidad)}>vender</button>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}