'use client';
import { useEffect, useState } from 'react';
import { Inversor } from '@/types/index';

export default function ListInversores() {
    const [inversores, setInversores] = useState<Inversor[]>([]);


    useEffect(() => {
        const fetchInversores = async () => {
            const response = await fetch("http://localhost:3000/inversor",
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            const data = await response.json();

            if (response.ok) {
                setInversores(data);
            }
        }
        fetchInversores();
    }, []);

    return (
        <div className="min-h-screen bg-gray-800 py-6">
            <div className="flex gap-6 p-6 min-h-screen bg-gray-800 justify-center">
                <div className="w-2/5 bg-gray-700 rounded-xl border border-green-500 p-6">
                    <h1 className="text-xl font-bold text-white mb-4">Listado de Inversores</h1>
                    <div className="grid grid-cols-3 font-bold text-white mb-4 gap-x-4">
                        <p>Nombre</p>
                        <p>Email</p>
                        <p>Rol</p>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {inversores.map((inversor) => (
                            <li key={inversor.id} className="grid grid-cols-3 py-3 px-2">
                                <span className="font-medium text-white">{inversor.nombre}</span>
                                <span className="text-sm text-slate-400">{inversor.email}</span>
                                <span className="text-green-600 font-semibold">{inversor.rol}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}