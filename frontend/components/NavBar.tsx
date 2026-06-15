import Link from 'next/link';

export default function NavBar() {   
    return (
        <>
            <nav x-data="{ isOpen: false }" className="relative bg-gray-200">
                <div className="container px-6 py-6 mx-auto md:flex md:justify-between md:items-center">
                    <div className="flex items-center justify-between">
                        <a href="/">
                            <img className="w-20" src="/logo-simulador.png" alt="Logo Simulador de Inversiones"/>
                        </a>
                    <div className="flex lg:hidden">
                        <button x-cloak="true" type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
                                <svg x-show="!isOpen" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                                <svg x-show="isOpen" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    </div>

                    <div x-cloak="true" className="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out   md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center">
                        <div className="flex flex-col md:flex-row md:mx-6">
                            <Link href="/auth/login" className="my-2 text-mark font-semibold transition-colors duration-300 transform  hover:text-blue-500  md:mx-4 md:my-0">Login</Link>
                            <Link href="/auth/register" className="my-2 text-mark font-semibold transition-colors duration-300 transform  hover:text-blue-500  md:mx-4 md:my-0">Registro</Link>
                        </div>                        
                    </div>
                </div>
            </nav>
        </>
    )
}