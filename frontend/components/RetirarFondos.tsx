'use client';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RetirarFondos(){
    const [monto, setMonto] = useState(0);
    const [cbu, setCbu] = useState('');
    const [titular, setTitular] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    
    function handleSubmit(e: SyntheticEvent){
        e.preventDefault();
        const fetchRetiroFondos = async () => {
            const response = await fetch("http://localhost:3000/inversor/retirar-fondos", 
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
            });
            const data = await response.json();

            if(!response.ok) {
                setMessage(data.message);
            } else{
                router.push('/inversor');
            }
        }
        fetchRetiroFondos();
    }
    
    function handleReset(){
        setMonto(0);
        setCbu('');
        setTitular('');
    }

    return(
        <div className="min-h-screen bg-gray-800 py-6">
            <div className="flex gap-6 p-6 min-h-screen bg-gray-800 justify-center">
                <form onSubmit={handleSubmit} onReset={handleReset}>
                    <div className="flex flex-col gap-4 p-6 bg-gray-700 rounded-xl border border-green-600">
                        <h1 className="text-xl font-bold text-white-800 mb-4">Ingrese sus datos</h1>
                        <input
                            className="bg-gray-500 rounded-xl shadow p-2 appearance-none"
                            id="cantidad"
                            type="text"
                            placeholder="Monto a retirar"
                            value={monto === 0 ? '' : monto}
                            onChange={(e) => {
                                const valor = e.target.value.replace(/\D/g, '');
                                setMonto(Number(valor));
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