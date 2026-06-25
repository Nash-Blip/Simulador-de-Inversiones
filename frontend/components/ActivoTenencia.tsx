'use client';

import { useState, useEffect } from "react";
import { Activo } from "@/types/index";

interface Tenencia {
    activo: Activo;
    cantidad: number;
    rendimiento: number;
    precioCompra: number;
}

interface TarjetaProps {
    tenencia: Tenencia; 
    onVender: (activo: Activo, cantidad: number) => void;
}


import React from "react";

export const ActivoTenencia = React.memo(function ActivoTenencia({ tenencia, onVender }: TarjetaProps) {
    const [cantidad, setCantidadVenta] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        setCantidadVenta(0);
    }, [tenencia.cantidad]);

    const ejecutarValidacionVenta = () => {
        if (cantidad <= 0) {
            setErrorMsg("Ingresá una cantidad válida mayor a 0.");
            return;
        }

        if (cantidad > tenencia.cantidad) {
            setErrorMsg(`No podés vender más de la cantidad adquirida.`);
            return;
        }

        setErrorMsg(null);
        onVender(tenencia.activo, cantidad);
    };

    return (
        <div className="w-full max-w-sm px-4 py-3 bg-white rounded-xl shadow-md dark:bg-zinc-800 flex flex-col gap-3">
            {/* Encabezado: Ticker */}
            <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-bold text-blue-800 uppercase bg-blue-200 rounded-full dark:bg-blue-300 dark:text-blue-900">
                    {tenencia.activo.ticker}
                </span>
            </div>

            {/* Datos del Activo */}
            <div>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">{tenencia.activo.nombre}</h1>
                <div className="flex items-center mt-2 justify-between text-sm text-gray-700 dark:text-gray-200">
                    <h3>Cantidad: <strong>{tenencia.cantidad}</strong></h3>
                    <h3>Rendimiento: <span className={tenencia.rendimiento >= 0 ? "text-green-500" : "text-red-500"}>{tenencia.rendimiento}%</span></h3>
                </div>

                <div className="flex items-center mt-2 justify-between text-sm text-gray-700 dark:text-gray-200 text-center">
                    <h3>Precio Actual: ${tenencia.activo.precioActual.toFixed(2)}</h3>
                    <h3>PPC: ${tenencia.precioCompra.toFixed(2)}</h3>
                    <h3>Total Tenencia: ${(tenencia.activo.precioActual * tenencia.cantidad).toFixed(2)}</h3>
                </div>

                <div className="flex items-center mt-2 justify-between text-sm text-gray-700 dark:text-gray-200 font-bold border-t pt-2 border-gray-200 dark:border-gray-700">
                    <h3>Total a Vender:</h3>
                    <h3>
                        {cantidad > tenencia.cantidad ? "$ -" : `$${(tenencia.activo.precioActual * cantidad).toFixed(2)}`}
                    </h3>
                </div>
            </div>

            {/* Acciones */}
            <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <input
                        className="bg-gray-200 dark:bg-zinc-700 w-full rounded-xl shadow p-2 text-center text-gray-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        id={`cantidad-${tenencia.activo.id}`}
                        placeholder="Cantidad a vender"
                        min={1}
                        step={1}
                        max={tenencia.cantidad}
                        type="number"
                        value={cantidad === 0 ? '' : cantidad}
                        onChange={(e) => {
                            setErrorMsg(null);
                            setCantidadVenta(Number(e.target.value));
                        }}
                    />
                </div>

                {errorMsg && (
                    <div className="bg-status-error text-white text-xs p-2 rounded-lg text-center font-medium animate-pulse">
                        {errorMsg}
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        className="w-full bg-status-success hover:opacity-90 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer text-sm"
                        onClick={ejecutarValidacionVenta}
                    >
                        Confirmar Venta
                    </button>
                </div>
            </div>
        </div>
    );
});