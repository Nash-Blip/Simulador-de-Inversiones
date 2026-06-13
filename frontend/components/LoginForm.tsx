"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const fetchLogin = async () => {
            const response = await fetch("http://localhost:3000/auth/login",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({ email, password })
                });
            const data = await response.json();

            if (response.ok) {
                window.location.href = '/';
            } else {
                setMessage(data.message);
            }
        }

        fetchLogin();
    }

    function handleReset() {
        setEmail('');
        setPassword('');
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-800">
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <div className="flex flex-col gap-4 p-6 bg-gray-700 rounded-xl border border-green-600">
                    <label htmlFor="email">Email</label>
                    <input className="bg-gray-500 rounded-xl shadow p-2" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">Password</label>
                    <input className="bg-gray-500 rounded-xl shadow p-2" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button className="bg-green-600 rounded-xl shadow p-2 text-sm text-white-600 hover:text-black transition-colors cursor-pointer" type="submit">Enviar</button>
                    <button className="bg-green-600 rounded-xl shadow p-2 text-sm text-white-600 hover:text-black transition-colors cursor-pointer" type="reset">Restablecer</button>
                    <p>{message}</p>
                    <p>¿No estás registrado? <Link href="/auth/register" className="text-green-400 hover:text-black">Registrarse</Link></p>
                </div>
            </form>
        </div>
    );
}