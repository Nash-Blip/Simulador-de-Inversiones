"use client";
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const fetchLogin = async () => {
            const response = await fetch("http://localhost:3000/auth/login",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
            const data = await response.json();
            setToken(data.token);
        }

        fetchLogin();
    }

    function handleReset() {
        setEmail('');
        setPassword('');
    }
    return (
        <div>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <label htmlFor="email">email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="password">password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Enviar</button>
                <button type="reset">Restablecer</button>
            </form>
        </div>
    );
}