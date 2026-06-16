'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [nombre, setNombre] = useState('');
    const [isRedirecting, setIsRedirecting] = useState(false); 
    const router = useRouter();

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();

        const executeRegisterAndLogin = async () => {
            setMessage(''); 

            try {
                
                const registerResponse = await fetch("http://localhost:3000/auth/register", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });

                const registerData = await registerResponse.json();

                if (!registerResponse.ok) {
                    
                    setMessage(registerData.message || "Error al registrar el usuario");
                    return;
                }

                
                setIsRedirecting(true); 
                setMessage("¡Registro exitoso! Iniciando sesión automáticamente...");

                const loginResponse = await fetch("http://localhost:3000/auth/login", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include", 
                    body: JSON.stringify({ email, password }) 
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    
                    router.push('/mercado');
                } else {
                    
                    setIsRedirecting(false);
                    setMessage(`Registrado con éxito, pero falló el login automático: ${loginData.message}. Por favor, ingresá manualmente.`);
                    router.push('/auth/login');
                }

            } catch (error) {
                console.error("Error en el flujo de autenticación:", error);
                setIsRedirecting(false);
                setMessage("Error de conexión con el servidor.");
            }
        };

        executeRegisterAndLogin();
    }

    function handleReset() {
        setNombre('');
        setEmail('');
        setPassword('');
        setMessage('');
    }

    return (
        <>
            <section className="bg-white dark:bg-gray-900">
                <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
                    <form onSubmit={handleSubmit} onReset={handleReset} className="w-full max-w-md">
                        <div className="flex justify-center mx-auto">
                            <Link href="/"><img className="w-auto h-7 sm:h-8" src="/logo-simulador.png" alt="" /></Link>
                        </div>

                        <div className="flex items-center justify-center mt-6">
                            <a href="/auth/login" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b dark:border-gray-400 dark:text-gray-300">
                                Login
                            </a>

                            <a href="#" className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b-2 border-blue-500 dark:border-blue-400 dark:text-white">
                                Registro
                            </a>
                        </div>

                        <div className="relative flex items-center mt-8">
                            <span className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>

                            <input id="nombre"
                                type="text"
                                value={nombre}
                                disabled={isRedirecting}
                                placeholder="Nombre completo"
                                onChange={(e) => setNombre(e.target.value)}
                                required className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>

                        <div className="relative flex items-center mt-4">
                            <span className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>

                            <input id="email"
                                type="email"
                                value={email}
                                disabled={isRedirecting}
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
                        </div>

                        <div className="relative flex items-center mt-4">
                            <span className="absolute">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>

                            <input id="password"
                                type="password"
                                value={password}
                                disabled={isRedirecting}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                                required className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"/>
                        </div>

                        <div className="mt-6 text-center">
                            <button className="w-2/4 px-6 py-3 text-sm font-medium tracking-wide cursor-pointer text-white capitalize transition-colors duration-300 transform bg-status-success rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                Registrarse
                            </button>                           
                        </div>
                        {message && (
                            <p className={`text-sm mt-4 text-center font-medium ${isRedirecting ? 'text-green-400' : 'text-red-400'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </section>

        </>
    );
}