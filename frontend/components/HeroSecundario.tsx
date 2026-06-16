export default function HeroSecundario() {
    return (
        <>
            <section className="bg-darkblue w-full">
                <div className="container px-6 py-10 mx-auto">
                    <div className="lg:flex lg:-mx-6">
                        <div className="lg:w-3/4 lg:px-6">
                            <img className="object-cover object-center w-full h-80 xl:h-[420px] rounded-xl" src="https://images.unsplash.com/photo-1624996379697-f01d168b1a52?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt="" />
                        </div>
                        <div className="mt-8 lg:w-1/4 lg:mt-0 lg:px-6">
                            <div>
                                <h3 className="text-blue-500 capitalize">ESTRATEGIA</h3>
                                <a href="https://www.bloomberglinea.com/mercados/que-esperar-del-balance-de-apple-esto-anticipa-un-gigante-de-wall-street/" target="_blank" rel="noopener noreferrer" className="block mt-2 font-medium text-gray-300 hover:underline hover:text-gray-500 ">
                                    ¿Es momento de comprar Cedears de Apple? Análisis de su último balance trimestral.
                                </a>
                            </div>

                            <hr className="my-6 border-gray-200 dark:border-gray-700" />

                            <div>
                                <h3 className="text-blue-500 capitalize">INDICADORES</h3>
                                <a href="https://admiralmarkets.com/es/education/articles/forex-indicators/como-sacar-beneficio-del-indicador-de-trading-rsi/" target="_blank" rel="noopener noreferrer" className="block mt-2 font-medium text-gray-300 hover:underline hover:text-gray-500  ">
                                    Guía práctica para usar el RSI y detectar cuándo un activo está sobrecomprado.
                                </a>
                            </div>

                            <hr className="my-6 border-gray-200 dark:border-gray-700" />

                            <div>
                                <h3 className="text-blue-500 capitalize">MERCADO CRIPTO</h3>
                                <a href="https://launchpad.ripio.com/blog/que-son-las-stablecoins" target="_blank" rel="noopener noreferrer" className="block mt-2 font-medium text-gray-300 hover:underline hover:text-gray-500  ">
                                    Qué son las Stablecoins y cómo usarlas como refugio durante caídas del mercado.
                                </a>
                            </div>

                            <hr className="my-6 border-gray-200 dark:border-gray-700" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}