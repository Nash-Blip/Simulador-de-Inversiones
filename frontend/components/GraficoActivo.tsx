"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    ScriptableContext
} from "chart.js";
import { getActivoById } from "@/service/Activo.service";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler
);

interface GraficoActivoProps {
    id: number | string;
    ticker: string;
    precioActual: number;
}

export default function GraficoActivo({ id, ticker, precioActual }: GraficoActivoProps) {
    const [historial, setHistorial] = useState<number[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarHistorialBackend = async () => {
            try {
                setCargando(true);
                const data = await getActivoById(id);
                const ultimasTransacciones = data.transacciones ? data.transacciones.slice(-20) : [];
                const preciosMapped = ultimasTransacciones.map((t: any) => t.precioEjecutado / t.cantidad);

                setHistorial(preciosMapped.length > 0 ? preciosMapped : [precioActual]);
            } catch (error) {
                console.error("Error al cargar histórico del activo:", error);
                setHistorial([precioActual]);
            } finally {
                setCargando(false);
            }
        };

        cargarHistorialBackend();
    }, [id]);

    useEffect(() => {
        if (cargando) return;

        setHistorial((prev) => {
            if (prev[prev.length - 1] === precioActual) return prev;

            const nuevoHistorial = [...prev, precioActual];
            if (nuevoHistorial.length > 20) nuevoHistorial.shift();
            return nuevoHistorial;
        });
    }, [precioActual, cargando]);

    const labels = historial.map((_, index) => `Op ${index + 1}`);

    const data = {
        labels,
        datasets: [
            {
                label: "Precio",
                data: historial,
                borderColor: "#3b82f6",
                borderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 6,
                tension: 0.2,
                fill: true,
                backgroundColor: (context: ScriptableContext<"line">) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)");
                    gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
                    return gradient;
                },
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { color: "rgba(255, 255, 255, 0.05)" },
                ticks: { color: "#9ca3af", font: { size: 10 } },
            },
            y: {
                grid: { color: "rgba(255, 255, 255, 0.05)" },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 11 },
                    callback: function (value: any) {
                        return "$" + Number(value).toFixed(2);
                    },
                },
            },
        },
    };

    if (cargando) {
        return (
            <div className="w-full h-48 bg-gray-900/60 flex items-center justify-center rounded-xl border border-gray-700 mt-2 animate-pulse">
                <span className="text-gray-500 text-xs tracking-wider">Cargando historial...</span>
            </div>
        );
    }

    return (
        <div className="w-full h-48 bg-gray-900/60 p-2 rounded-xl border border-gray-700 mt-2">
            <Line data={data} options={options} />
        </div>
    );
}