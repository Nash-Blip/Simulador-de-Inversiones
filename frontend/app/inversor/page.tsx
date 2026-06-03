'use client';

import { Portafolio, TenenciaActivo } from '../types/index';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
                    <p>Valor del portafolio: {portafolio.valorPortafolio}</p>
                    <ul>
                        {portafolio.tenencias.map((tenencia) => (
                            <li key={tenencia.id}>
                                {tenencia.activo.nombre} - {tenencia.cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
}