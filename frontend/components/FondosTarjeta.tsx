'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FondosTarjeta() {
    const [monto, setMontoIngresado] = useState(0);
    const [numeroTarjeta, setTarjeta] = useState('');
    const [cvv, setCvv] = useState('');
    const [vencimiento, setVencimiento] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const fetchSaldoTarjeta = async () => {
            const response = await fetch("http://localhost:3000/inversor/ingresar-fondos-tarjeta",
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            monto,
                            numeroTarjeta,
                            cvv,
                            vencimiento
                        }
                    )
                }
            );
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message);
            } else{
                router.push('/inversor');
            }
        }
        fetchSaldoTarjeta();
    }

    function handleReset() {
        setMontoIngresado(0);
        setTarjeta('');
        setCvv('');
        setVencimiento('');
    }

    return (
        <div className="min-h-screen bg-gray-800 py-6">
            <div className="flex gap-6 p-6 min-h-screen bg-gray-800 justify-center">
                <form onSubmit={handleSubmit} onReset={handleReset}>
                    <div className="flex flex-col gap-4 p-6 bg-gray-700 rounded-xl border border-green-600">
                        <h1 className="text-xl font-bold text-white-800 mb-4">Ingrese sus datos</h1>
                        <input
                            className="bg-gray-500 rounded-xl shadow p-2 appearance-none"
                            id="cantidad"
                            type="text"
                            placeholder="Monto a ingresar"
                            value={monto === 0 ? '' : monto}
                            onChange={(e) => {
                                const valor = e.target.value.replace(/\D/g, '');
                                setMontoIngresado(Number(valor));
                            }}
                        />
                        <input
                            className="bg-gray-500 rounded-xl shadow p-2 appearance-none"
                            id="tarjeta"
                            type="text"
                            placeholder="Numero de tarjeta"
                            value={numeroTarjeta}
                            onChange={(e) => {
                                setTarjeta(e.target.value)
                            }}
                        />
                        <input
                            className="bg-gray-500 rounded-xl shadow p-2 appearance-none"
                            id="cvv"
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => {
                                setCvv(e.target.value);
                            }}
                        />
                        <input
                            className="bg-gray-500 rounded-xl shadow p-2 appearance-none"
                            id="vencimiento"
                            type="text"
                            placeholder="Vencimiento"
                            value={vencimiento}
                            onChange={(e) => {
                                setVencimiento(e.target.value);
                            }}
                        />
                        <p>{message}</p>
                        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                            type="submit">Confirmar
                        </button>
                        <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                            type="reset">Restablecer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )

}