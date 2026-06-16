export default function Terminos() {
    return (
        <>
            <section className="w-full py-8 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">

                <div className="max-w-4xl mx-auto px-6 text-left">

                    <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                        Términos y Condiciones de Servicio
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">Última actualización: Junio 2026</p>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">1. Aceptación de los Términos</h2>
                            <p>Al acceder y utilizar este Simulador de Inversiones (en adelante, "la Plataforma"), usted acepta estar sujeto a los presentes Términos y Condiciones de Servicio. Si no está de acuerdo con alguno de estos términos, por favor, absténgase de utilizar este sitio web.</p>
                        </div>

                        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 dark:bg-zinc-800 dark:border-yellow-600 rounded">
                            <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-2">
                                2. EXENCIÓN DE RESPONSABILIDAD FINANCIERA (AVISO IMPORTANTE)
                            </h2>
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                Esta Plataforma es una herramienta exclusivamente DIDÁCTICA y EDUCATIVA. Todas las simulaciones, datos de mercado, gráficos, operaciones y saldos mostrados son virtuales y se realizan con DINERO FICTICIO.
                            </p>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">
                                Ninguno de los contenidos, herramientas o resultados generados en este sitio constituyen una oferta, recomendación, asesoramiento o invitación a invertir en mercados financieros reales. El rendimiento pasado de las simulaciones no garantiza resultados futuros en inversiones reales. Los creadores de la Plataforma no se hacen responsables de pérdidas económicas derivadas de decisiones que el usuario tome en el mercado financiero real basándose en el uso de este simulador.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">3. Registro y Seguridad de la Cuenta</h2>
                            <p>Para acceder a ciertas funciones del simulador, como guardar su historial de portafolio, es posible que deba registrarse creando una cuenta. Usted es responsable de:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Mantener la confidencialidad de sus credenciales de acceso (contraseña).</li>
                                <li>Proporcionar información de registro verídica y actualizada.</li>
                                <li>Notificar inmediatamente cualquier uso no autorizado de su cuenta.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">4. Propiedad Intelectual</h2>
                            <p>Todos los contenidos de la Plataforma, incluyendo de forma enunciativa pero no limitativa: logotipos, código fuente, interfaz gráfica, textos, iconos y herramientas de cálculo, son propiedad exclusiva de los desarrolladores o cuentan con las licencias correspondientes y están protegidos por las leyes de propiedad intelectual.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">5. Modificaciones del Servicio y de los Términos</h2>
                            <p>Nos reservamos el derecho de modificar, suspender o interrumpir el simulador (o cualquier parte del mismo) en cualquier momento, con o sin previo aviso. Asimismo, podemos actualizar estos términos en el futuro, reflejando los cambios mediante la fecha de "Última actualización" en la parte superior.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">6. Limitación de Responsabilidad</h2>
                            <p>La Plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido, libre de errores o que los datos de simulación reflejen con exactitud milimétrica el mercado en tiempo real debido a posibles retrasos en los proveedores de datos (APIs).</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}