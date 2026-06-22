export default function Equipo() {
    return (
        <>
            <section className="bg-white dark:bg-gray-900 w-full">
                <div className="container px-6 py-4  mx-auto mb-10">
                    <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700 w-1/3 mx-auto" />
                    
                    <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white pt-4">Nosotros</h1>

                    <p className="max-w-4xl mx-auto my-6 text-center text-gray-500 dark:text-gray-300">
                        Este simulador forma parte del proyecto de la materia Programacion III de la Tecnicatura de Programacion de la UTN. 

                        El objetivo de la plataforma es puramente educativo. Queríamos crear un espacio donde cualquier estudiante o principiante pueda entrar, ver gráficos interactivos con datos reales y simular compras o ventas usando dinero ficticio. Básicamente, diseñamos un entorno seguro para que puedas probar estrategias, experimentar con el mercado en vivo y aprender de los errores sin perder dinero.
                    </p>

                    <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 xl:grid-cols-5">
                        <div className="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-blue-600 dark:border-gray-700 dark:hover:border-transparent">
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                                <span>AB</span>
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white text-center">Agustin <br/> Begue</h1>
                                <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">Developer</p>
                        </div>

                        <div className="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-blue-600 dark:border-gray-700 dark:hover:border-transparent">
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                                <span>PD</span>
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white text-center">Pablo <br/> Duval</h1>
                            <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">Developer</p>
                        </div>

                        <div className="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-blue-600 dark:border-gray-700 dark:hover:border-transparent">
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                                <span>MF</span>
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white text-center">Matias <br/>Fernandez</h1>
                            <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">Developer</p>
                        </div>

                        <div className="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-blue-600 dark:border-gray-700 dark:hover:border-transparent">
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                                <span>RG</span>
                            </div>
                                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white text-center">Ramiro <br/>Gomez Rivelli</h1>
                            <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">Developer</p>
                        </div>

                        <div className="flex flex-col items-center p-8 transition-colors duration-300 transform border cursor-pointer rounded-xl hover:border-transparent group hover:bg-blue-600 dark:border-gray-700 dark:hover:border-transparent">
                            <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 text-2xl font-bold uppercase shadow-inner">
                                <span>AS</span>
                            </div>
                                <h1 className="mt-4 text-2xl font-semibold text-gray-700 capitalize dark:text-white group-hover:text-white text-center">Alejo <br/> Suarez</h1>
                            <p className="mt-2 text-gray-500 capitalize dark:text-gray-300 group-hover:text-gray-300">Developer</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}