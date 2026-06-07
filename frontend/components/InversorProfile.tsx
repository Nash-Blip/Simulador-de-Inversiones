'use client';

import { Portafolio } from '../types/index';
import { useState, useEffect } from 'react';

export default function InversorPage() {
    const [portafolio, setPortafolio] = useState<Portafolio | null>(null);

    useEffect(() => {
        const fetchInversor = async () => {
            const response = await fetch("http://localhost:3000/inversor/portafolio",
                {
                    method: 'GET',
                    credentials: "include",
                });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setPortafolio(data);
            }
        }

        fetchInversor();
    }, []);

    return (
        <div>
            {portafolio ? (
                <div>
                    <p>Costo del portafolio: {portafolio.costoPortafolio}</p>
                    <div className="grid grid-cols-2">
                        <p>Activo</p>
                        <p>Cantidad</p>
                    </div>
                    {portafolio.tenencias.map((tenencia) => (
                        <div key={tenencia.id} className="grid grid-cols-2">
                            <span>{tenencia.activo.nombre}</span>
                            <span>{tenencia.cantidad}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}