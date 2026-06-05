'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [nombre, setNombre] = useState('');
    const [register, setRegister] = useState(false);
    const router = useRouter();

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const fetchRegister = async () => {
            const response = await fetch("http://localhost:3000/auth/register",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });
            const data = await response.json();

            if (response.ok) {
                setRegister(true);
            } else {
                setMessage(data.message);
            }
        }

        fetchRegister();
    }

    function handleReset() {
        setNombre('');
        setEmail('');
        setPassword('');
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <div className="flex flex-col gap-4 p-6 bg-gray-700 rounded-xl border border-green-600">
                {register ? (
                    <div className="flex flex-col gap-4 shadow p-6 bg-gray-700 rounded-xl">
                        <p>Registrado Correctamente</p>
                        <button className="bg-green-600 rounded-xl shadow p-2" onClick={() => router.push('/auth/login')}>continuar</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} onReset={handleReset}>
                        <div className="flex flex-col gap-4 shadow p-6 bg-gray-700 rounded-xl">
                            <label htmlFor="nombre">Nombre</label>
                            <input className="bg-gray-500 rounded-xl shadow p-2" id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}></input>
                            <label htmlFor="email">Email</label>
                            <input className="bg-gray-500 rounded-xl shadow p-2" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <label htmlFor="password">Password</label>
                            <input className="bg-gray-500 rounded-xl shadow p-2" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <button className="bg-green-600 rounded-xl shadow p-2" type="submit">Enviar</button>
                            <button className="bg-green-600 rounded-xl shadow p-2" type="reset">Restablecer</button>
                            <p>{message}</p>
                            <p>¿Ya tenes cuenta? <Link href="/auth/login" className="text-green-400 hover:text-green-300">Inicia Sesion</Link></p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}