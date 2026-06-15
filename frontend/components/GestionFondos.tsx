"use client";

import { useState, useEffect } from "react";

type OperacionActual = "ingreso_transf" | "ingreso_tarjeta" | "retiro";

export default function GestionFondos() {
    const [tabActual, setTabActual] = useState<OperacionActual>("ingreso_transf");
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);
    const [saldoVirtual, setSaldoVirtual] = useState<number | null>(null);
    const [formTransf, setFormTransf] = useState({ monto: "", cbu: "", titular: "" });
    const [formTarjeta, setFormTarjeta] = useState({ monto: "", numeroTarjeta: "", cvv: "", vencimiento: "" });

    const regexTitular = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
    const regexCbu = /^\d{22}$/;
    const regexTarjeta = /^\d{16}$/;
    const regexVencimiento = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const regexCvv = /^\d{3,4}$/;

    const fetchSaldo = async () => {
        try {
            const response = await fetch("http://localhost:3000/inversor/portafolio", {
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setSaldoVirtual(data.saldoVirtual);
            } else {
                console.error("Error al obtener el portafolio");
            }
        } catch (error) {
            console.error("Error de conexión al obtener el saldo:", error);
        }
    };

    useEffect(() => {
        fetchSaldo();
    }, []);

    const handleTransfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "cbu" && (!/^\d*$/.test(value) || value.length > 22)) return;
        setFormTransf(prev => ({ ...prev, [name]: value }));
    };

    const handleTarjetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "numeroTarjeta" && (!/^\d*$/.test(value) || value.length > 16)) return;
        if (name === "cvv" && (!/^\d*$/.test(value) || value.length > 4)) return;
        setFormTarjeta(prev => ({ ...prev, [name]: value }));
    };

    const validarFormulario = (): boolean => {
        const montoNum = tabActual === "ingreso_tarjeta" ? Number(formTarjeta.monto) : Number(formTransf.monto);

        if (isNaN(montoNum) || montoNum <= 0) {
            setMensaje({ tipo: "error", texto: "El monto debe ser un número positivo." });
            return false;
        }

        if (tabActual === "ingreso_transf" || tabActual === "retiro") {
            if (!regexCbu.test(formTransf.cbu)) {
                setMensaje({ tipo: "error", texto: "CBU inválido. Deben ser exactamente 22 dígitos numéricos." });
                return false;
            }
            if (!regexTitular.test(formTransf.titular.trim())) {
                setMensaje({ tipo: "error", texto: "Nombre del titular inválido (mínimo 3 caracteres, solo letras)." });
                return false;
            }
            if (tabActual === "retiro" && saldoVirtual !== null && montoNum > saldoVirtual) {
                setMensaje({ tipo: "error", texto: "Fondos insuficientes para realizar este retiro." });
                return false;
            }
        }

        if (tabActual === "ingreso_tarjeta") {
            if (!regexTarjeta.test(formTarjeta.numeroTarjeta)) {
                setMensaje({ tipo: "error", texto: "Número de tarjeta inválido. Deben ser 16 dígitos." });
                return false;
            }
            if (!regexVencimiento.test(formTarjeta.vencimiento)) {
                setMensaje({ tipo: "error", texto: "Formato de vencimiento inválido. Use MM/AA (Ej: 12/28)." });
                return false;
            }
            if (!regexCvv.test(formTarjeta.cvv)) {
                setMensaje({ tipo: "error", texto: "Código CVV inválido. Deben ser 3 o 4 dígitos." });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMensaje(null);

        if (!validarFormulario()) return;

        let endpoint = "";
        let bodyPayload = {};

        if (tabActual === "ingreso_transf") {
            endpoint = "http://localhost:3000/inversor/ingresar-fondos-transferencia";
            bodyPayload = { monto: Number(formTransf.monto), cbu: formTransf.cbu, titular: formTransf.titular };
        } else if (tabActual === "retiro") {
            endpoint = "http://localhost:3000/inversor/retirar-fondos";
            bodyPayload = { monto: Number(formTransf.monto), cbu: formTransf.cbu, titular: formTransf.titular };
        } else if (tabActual === "ingreso_tarjeta") {
            endpoint = "http://localhost:3000/inversor/ingresar-fondos-tarjeta";
            bodyPayload = {
                monto: Number(formTarjeta.monto),
                numeroTarjeta: formTarjeta.numeroTarjeta,
                cvv: formTarjeta.cvv,
                vencimiento: formTarjeta.vencimiento
            };
        }

        try {
            setCargando(true);
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyPayload),
                credentials: "include"
            });

            if (response.ok) {
                setMensaje({ tipo: "exito", texto: "¡Operación procesada con éxito!" });

                setFormTransf({ monto: "", cbu: "", titular: "" });
                setFormTarjeta({ monto: "", numeroTarjeta: "", cvv: "", vencimiento: "" });

                await fetchSaldo();
            } else {
                const errData = await response.json().catch(() => ({}));
                setMensaje({ tipo: "error", texto: errData.message || "Error al procesar la transacción." });
            }
        } catch (error) {
            setMensaje({ tipo: "error", texto: "Hubo un problema de conexión con el servidor." });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-[#0b0f19] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden p-6">

            <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mb-6 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Saldo Virtual Disponible</p>
                <div className="text-3xl font-extrabold text-blue-400 min-h-10 flex items-center justify-center">
                    {saldoVirtual !== null ? (
                        `$${saldoVirtual.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    ) : (
                        <span className="text-gray-600 text-xl animate-pulse">Cargando saldo...</span>
                    )}
                </div>
            </div>

            <div className="flex bg-gray-900 p-1 rounded-xl mb-6 border border-gray-800">
                <button
                    type="button"
                    onClick={() => { setTabActual("ingreso_transf"); setMensaje(null); }}
                    className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-lg transition-all cursor-pointer ${tabActual === "ingreso_transf" ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white"
                        }`}
                >
                    Ingresar (Transf.)
                </button>
                <button
                    type="button"
                    onClick={() => { setTabActual("ingreso_tarjeta"); setMensaje(null); }}
                    className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-lg transition-all cursor-pointer ${tabActual === "ingreso_tarjeta" ? "bg-blue-600 text-white shadow" : "text-gray-400 hover:text-white"
                        }`}
                >
                    Ingresar (Tarjeta)
                </button>
                <button
                    type="button"
                    onClick={() => { setTabActual("retiro"); setMensaje(null); }}
                    className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-lg transition-all cursor-pointer ${tabActual === "retiro" ? "bg-amber-600 text-white shadow" : "text-gray-400 hover:text-white"
                        }`}
                >
                    Retirar Fondos
                </button>
            </div>

            {mensaje && (
                <div className={`mb-4 p-3 rounded-xl text-center text-sm font-medium ${mensaje.tipo === "exito" ? "bg-status-success text-white animate-fade-in" : "bg-status-error text-white animate-shake"
                    }`}>
                    {mensaje.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {tabActual === "ingreso_transf" || tabActual === "retiro" ? (
                    <>
                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Monto a Ingresar</label>
                            <input
                                required
                                name="monto"
                                type="number"
                                min="1"
                                step="any"
                                placeholder="0.00"
                                value={formTransf.monto}
                                onChange={handleTransfChange}
                                className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">CBU (22 digitos)</label>
                            <input
                                required
                                name="cbu"
                                type="text"
                                placeholder="0000000000000000000000"
                                value={formTransf.cbu}
                                onChange={handleTransfChange}
                                className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white font-mono tracking-widest text-center focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <span className="text-right block text-xs text-gray-500 mt-1">
                                {formTransf.cbu.length}/22 digitos
                            </span>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Titular de la Cuenta</label>
                            <input
                                required
                                name="titular"
                                type="text"
                                placeholder="Nombre completo del titular"
                                value={formTransf.titular}
                                onChange={handleTransfChange}
                                className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Monto a Ingresar</label>
                            <input
                                required
                                name="monto"
                                type="number"
                                min="1"
                                step="any"
                                placeholder="0.00"
                                value={formTarjeta.monto}
                                onChange={handleTarjetaChange}
                                    className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-blue-500 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Número de Tarjeta</label>
                            <input
                                required
                                name="numeroTarjeta"
                                type="text"
                                placeholder="4517640011223344"
                                value={formTarjeta.numeroTarjeta}
                                onChange={handleTarjetaChange}
                                className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white tracking-widest text-center focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <span className="text-right block text-xs text-gray-500 mt-1">
                                    {formTarjeta.numeroTarjeta.length}/16 digitos
                                </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Vencimiento</label>
                                <input
                                    required
                                    name="vencimiento"
                                    type="text"
                                    placeholder="MM/AA"
                                    maxLength={5}
                                    value={formTarjeta.vencimiento}
                                    onChange={(e) => setFormTarjeta(prev => ({ ...prev, vencimiento: e.target.value }))}
                                    className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white text-center focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">CVV</label>
                                <input
                                    required
                                    name="cvv"
                                    type="password"
                                    placeholder="•••"
                                    value={formTarjeta.cvv}
                                    onChange={handleTarjetaChange}
                                    className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl p-3 text-white text-center tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                    </>
                )}

                <button
                    type="submit"
                    disabled={cargando || saldoVirtual === null}
                    className={`w-full font-bold py-3 px-6 rounded-xl transition-all text-white text-center cursor-pointer mt-4 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${tabActual === "retiro"
                            ? "bg-amber-600 hover:bg-amber-500 shadow-amber-900/20"
                            : "bg-status-success hover:bg-green-500 shadow-green-900/20"
                        }`}
                >
                    {cargando ? "Procesando..." : tabActual === "retiro" ? "Confirmar Retiro" : "Confirmar Ingreso"}
                </button>
            </form>
        </div>
    );
}