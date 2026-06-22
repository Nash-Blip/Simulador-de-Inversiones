'use client';

import { cambiarPassword, getPerfil } from "@/service/Inversor.service";
import { useEffect, useState } from "react";

interface PerfilData {
    nombre: string;
    email?: string;
}

export default function InversorProfile() {
    const [perfil, setPerfil] = useState<PerfilData | null>(null);
    const [cargando, setCargando] = useState(true);

    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNueva, setPasswordNueva] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [exito, setExito] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const data = await getPerfil();
                setPerfil(data);
            } catch (err) {
                setError("Error de conexión con el servidor.");
            } finally {
                setCargando(false);
            }
        };

        fetchPerfil();
    }, []);

    const handleCambiarPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setExito(null);

        if (!passwordActual || !passwordNueva || !confirmarPassword) {
            setError("Todos los campos son obligatorios.");
            return;
        }

        if (passwordNueva.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (passwordNueva !== confirmarPassword) {
            setError("La nueva contraseña y la confirmación no coinciden.");
            return;
        }

        setEnviando(true);

        try {
            await cambiarPassword(passwordActual, passwordNueva);
            setExito("Contraseña actualizada correctamente.");

            setPasswordActual("");
            setPasswordNueva("");
            setConfirmarPassword("");
        } catch (err) {
            setError("Ocurrió un error al intentar cambiar la contraseña.");
        } finally {
            setEnviando(false);
        }
    };

    if (cargando) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <span className="text-blue-400 font-medium animate-pulse">Cargando ajustes...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 py-6">

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                    Ajustes de Cuenta
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="md:col-span-1 bg-zinc-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center justify-center space-y-4 shadow-lg">
                    <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                        {perfil ? `${perfil.nombre[0]}` : "U"}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white capitalize">
                            {perfil ? `${perfil.nombre}` : "Usuario Inversor"}
                        </h2>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-3">
                            {perfil?.email}
                        </span>
                    </div>
                </div>

                <div className="md:col-span-2 bg-zinc-900 border border-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold border-b border-gray-800 pb-3 mb-4">Seguridad</h3>

                    <form onSubmit={handleCambiarPassword} className="space-y-4">

                        {error && (
                            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                                ⚠️ {error}
                            </div>
                        )}
                        {exito && (
                            <div className="p-3 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl">
                                ✅ {exito}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Contraseña Actual <sup className="text-red-400">*</sup>
                            </label>
                            <input
                                type="password"
                                value={passwordActual}
                                onChange={(e) => setPasswordActual(e.target.value)}
                                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Nueva Contraseña <sup className="text-red-400">*</sup>
                            </label>
                            <input
                                type="password"
                                value={passwordNueva}
                                onChange={(e) => setPasswordNueva(e.target.value)}
                                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                Confirmar Nueva Contraseña <sup className="text-red-400">*</sup>
                            </label>
                            <input
                                type="password"
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                className="w-full bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Repetí tu nueva contraseña"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={enviando}
                                className="bg-status-success cursor-pointer text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                            >
                                {enviando ? "Actualizando..." : "Actualizar Contraseña"}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}