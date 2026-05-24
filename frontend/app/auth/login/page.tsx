"use client";
import { useState } from 'react';

export default function LoginPage() {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        const fetchLogin = async () => {
            const response = await fetch("http://localhost:3000/auth/login",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, password })
                });
            const data = await response.json();
            setToken(data.token);
        }

        fetchLogin();
    }

    function handleReset() {
        setUsuario('');
        setPassword('');
    }
    return (
        <div>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                <label htmlFor="usuario">usuario</label>
                <input id="usuario" type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                <label htmlFor="password">password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Enviar</button>
                <button type="reset">Restablecer</button>
            </form>
        </div>
    );
}