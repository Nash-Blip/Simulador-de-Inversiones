import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <footer className="mt-4 bg-gray-950">
                <div className="container px-6 py-8 mx-auto">
                    <div className="flex flex-col items-center text-center">
                        <a href="/">
                            <img className="w-auto h-7" src="/logo-simulador.png" alt=""/>
                        </a>

                        <div className="flex flex-wrap justify-center mt-6 -mx-4">
                            <Link href="/privacidad" className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">Privacidad</Link>
                            <Link href="/terminos" className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">Terminos y Condiciones</Link>
                            <Link href="/contacto" className="mx-4 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400">Contacto</Link>
                        </div>
                        <div className="flex flex-wrap justify-center mt-6 -mx-4 p-4 bg-white">
                            <Link href="https://www.byma.com.ar/" target='_blank' rel="noopener noreferrer" className="mx-4 mt-2 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"><img src="/byma.png" alt="Comision Nacional de Valores" className="w-32" /></Link>
                            <Link href="https://www.argentina.gob.ar/cnv" target='_blank' rel="noopener noreferrer" className="mx-4 mt-2 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"><img src="/cnv.png" alt="Comision Nacional de Valores" className="w-32" /></Link>
                            <Link href="https://www.matbarofex.com.ar/" target='_blank' rel="noopener noreferrer" className="mx-4 mt-2 text-sm text-gray-600 transition-colors duration-300 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"><img src="/rofex.png" alt="Comision Nacional de Valores" className="w-16" /></Link>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700 w-1/4 mx-auto" />

                    <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-300 mx-auto">© Copyright 2026 | Todos los derechos reservados.</p>
                    </div>

                    
                </div>
            </footer>
        </>
    )
}