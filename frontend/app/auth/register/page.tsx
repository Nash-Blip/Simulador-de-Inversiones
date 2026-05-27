'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage(){
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ message, setMessage ] = useState('');
    const [register, setRegister] = useState(false);
    const router = useRouter();

    function handleSubmit(e: React.SyntheticEvent){
        e.preventDefault();
        const fetchRegister = async () => {
            const response = await fetch("http://localhost:3000/auth/register",
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();

                if(response.ok){
                    setRegister(true);
                } else{
                    setMessage(data.message);
                }
        }

        fetchRegister();
    }
    
    function handleReset() {
        setEmail('');
        setPassword('');
    }
    return(
        <div>
            {register ? (
                <div>
                    <p>Registrado Correctamente</p>
                    <button onClick={() => router.push('/auth/login')}>continuar</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} onReset={handleReset}>
                    <label htmlFor="email">email</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="password">password</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Enviar</button>
                    <button type="reset">Restablecer</button>
                    <p>{message}</p>
                </form>
            )}
        </div>
    );
}