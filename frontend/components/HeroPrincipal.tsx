export default function HeroPrincipal() {
    return (
        <>
            <section className="bg-darkblue w-full ">
                <div className="container px-6 py-10 mx-auto">
                    <div className="mt-8 lg:-mx-6 lg:flex lg:items-center">
                        <img className="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-96" src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" alt=""/>
                        <div className="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
                            <h1 className="text-2xl font-semibold text-gray-800 lg:text-6xl dark:text-white my-4">Simulador de Inversiones</h1>

                            <p className="text-sm text-blue-500 uppercase">Entrenamiento Financiero</p>
                            <h2 className="block mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                                Operá mercados en tiempo real
                                </h2>
                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
                                Poné a prueba tus estrategias de trading con nuestro simulador avanzado. Aprendé a leer gráficos de velas, analizá la volatilidad de activos financieros o acciones de Wall Street, y gestioná tu cartera utilizando dinero ficticio antes de dar el salto al mercado real.
                            </p>
                            </div>
                    </div>
                </div>
            </section>
        </>
    )
}