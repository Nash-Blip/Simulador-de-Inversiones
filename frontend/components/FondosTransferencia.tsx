'use client';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function FondosTarjeta() {
    const [monto, setMontoIngresado] = useState(0);
    const [cbu, setCbu] = useState('');
    const [titular, setTitular] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const fetchSaldoTransferencia = async () => {
            const response = await fetch("http://localhost:3000/inversor/ingresar-fondos-transferencia",
                {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(
                        {
                            monto,
                            cbu,
                            titular
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
        fetchSaldoTransferencia();
    }

    function handleReset() {
        setMontoIngresado(0);
        setCbu('');
        setTitular('');
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
                            id="cbu"
                            type="text"
                            placeholder="Numero de CBU"
                            value={cbu}
                            onChange={(e) => {
                                setCbu(e.target.value)
                            }}
                        />
                        <input
                            className="bg-gray-500 rounded-xl shadow p-2 appearance-none"
                            id="cvv"
                            type="text"
                            placeholder="Titular"
                            value={titular}
                            onChange={(e) => {
                                setTitular(e.target.value);
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