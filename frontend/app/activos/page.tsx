"use client";
import { useState, useEffect } from 'react';

type Activo = {
    id: number;
    nombre: string;
    ticker: string;
    precioActual: number;
}

export default function ActivosPage() {
    const [activos, setActivos] = useState<Activo[]>([]);

    useEffect(() => {
        const fetchActivos = async () => {
            const response = await fetch("http://localhost:3000/activo");
            const data = await response.json();
            setActivos(data);
        }

        fetchActivos();
    }, []);

    return (
        <div>
            <h1>Listado de Activos</h1>
            <ul>
                {activos.map((activo) => (
                    <li key={activo.id}> {activo.nombre} - {activo.ticker} - {activo.precioActual}</li>
                ))}
            </ul>
        </div>
    );
}