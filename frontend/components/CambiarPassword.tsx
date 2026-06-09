'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CambiarPassword(){
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    async function handleChange() {
        const response = await fetch('http://localhost:3000/inversor/cambiar-password', {
            method: 'PATCH',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({passwordActual: actual, passwordNueva: nueva}),
            credentials: 'include'
        })
        const data = await response.json();
        if(!response.ok){
            setMessage(data.message)
        } else{
            router.push('/');
        }
    }
    function handleReset() {
        setActual('');
        setNueva('');
    }

    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <form onSubmit={(e) => {e.preventDefault(); handleChange(); }} onReset={handleReset}>
                <div className="flex flex-col gap-4 p-6 bg-gray-700 rounded-xl border border-green-600">
                    <label htmlFor="actual">Contraseña actual</label>
                    <input className="bg-gray-500 rounded-xl shadow p-2" id="passwordActual" type="password" value={actual} onChange={(e) => setActual(e.target.value)}/>
                    <label htmlFor="nueva">Contraseña nueva</label>
                    <input className="bg-gray-500 rounded-xl shadow p-2" id="passwordNueva" type="password" value={nueva} onChange={(e) => setNueva(e.target.value)}/>
                    <button className="bg-green-600 rounded-xl shadow p-2 text-sm text-white-600 hover:text-black transition-colors cursor-pointer" type="submit">Enviar</button>
                    <button className="bg-green-600 rounded-xl shadow p-2 text-sm text-white-600 hover:text-black transition-colors cursor-pointer" type="reset">Restablecer</button>
                    <p>{message}</p>
                </div>
            </form>
        </div>
    )
}