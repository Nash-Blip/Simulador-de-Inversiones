/* eslint-disable */
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/service/Auth.service';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    
    const fetchLogin = async () => {
      try {
        const user = await login(email, password);        
        if (user.inversor.rol === 'admin') {
          router.push('/admin/inversores');
        } else
        {
          router.push('/mercado');
        }
      } catch (error) {
        console.log(error);
        setMessage('Cuenta o contraseña incorrecta');
      }
    }

    fetchLogin();
  }

  return (
    <>
      <section className="w-full bg-white dark:bg-gray-900">
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <form className="w-full max-w-md">
            <div className="flex justify-center mx-auto">
              <Link href="/"><img className="w-auto h-7 sm:h-8" src="/logo-simulador.png" alt="" /></Link>
            </div>

            <div className="flex items-center justify-center mt-6">
              <a href="/auth/login" className="w-1/3 pb-4 font-medium text-center text-gray-500 capitalize border-b-2 dark:border-blue-400  dark:text-gray-300">
                Login
              </a>

              <a href="/auth/register" className="w-1/3 pb-4 font-medium text-center text-gray-800 capitalize border-b border-blue-500 dark:border-gray-400 dark:text-white">
                Registro
              </a>
            </div>

            <div className="relative flex items-center mt-6">
              <span className="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>

              <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email" />
            </div>

            <div className="relative flex items-center mt-4">
              <span className="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password" />
            </div>

            {message && (
              <div className="bg-status-error text-white text-xs p-2 rounded-lg text-center font-medium animate-pulse mt-4">
                {message}
              </div>
            )}

            <div className="mt-8 text-center ">
              <button onClick={handleSubmit} type="submit" className="w-2/4 mx-auto px-6 py-3 text-sm font-medium tracking-wide cursor-pointer text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Iniciar Sesion
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}