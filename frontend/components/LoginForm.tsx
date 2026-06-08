/* eslint-disable */
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

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
        router.push('/');
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
    <>
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-light rounded-lg border-2 p-4 dark:bg-dark">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            <img className="w-auto h-7 sm:h-8" src="https://merakiui.com/images/logo.svg" alt="" />
          </div>
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">Bienvenido</h3>
          {/* <p className="mt-1 text-center text-gray-500 dark:text-gray-400">Logueate para continuar</p> */}
          <form>
            <div className="w-full mt-4">
              <input className="block w-full px-4 py-2 mt-2 text-light placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" type="email" placeholder="Email " aria-label="Email" />
            </div>
            <div className="w-full mt-4">
              <input className="block w-full px-4 py-2 mt-2 text-light placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300" type="password" placeholder="Password" aria-label="Password" />
            </div>
            <div className="flex items-center justify-center mt-4">
              <button className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                Iniciar Sesion
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-mark">
          <span className="text-sm dark:text-light ">No estas registrado? </span>
          <a href="#" className="mx-2 text-sm font-bold text-mark dark:text-white hover:underline">Registrate</a>
        </div>
        
      </div>
    </>
  );
}