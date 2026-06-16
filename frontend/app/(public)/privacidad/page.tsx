export default function Privacidad() {
    return (
        <>
            <section className="w-full py-8 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900">

                <div className="max-w-4xl mx-auto px-6 text-left">

                    <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400">
                        Política de Privacidad
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">Última actualización: Junio 2026</p>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-3">1. Información que Recopilamos</h2>
                            <p>Nos comprometemos a proteger la privacidad de nuestros usuarios. En este Simulador de Inversiones, recopilamos los siguientes tipos de datos:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-2">
                                <li><strong>Datos de Registro:</strong> Cuando crea una cuenta, recopilamos información básica como su nombre, dirección de correo electrónico y contraseña (encriptada de forma segura).</li>
                                <li><strong>Datos de Uso y Simulación:</strong> Almacenamos los datos relacionados con su actividad en el simulador (historial de transacciones ficticias, composición del portafolio virtual, preferencias de configuración, etc.) con el único fin de proveer la funcionalidad del servicio.</li>
                                <li><strong>Datos Técnicos:</strong> Información estándar como dirección IP, tipo de navegador y cookies esenciales para mantener su sesión activa.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">2. Uso de la Información</h2>
                            <p>La información recopilada se utiliza exclusivamente para los siguientes propósitos:</p>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>Personalizar y guardar el progreso de sus portafolios de inversión virtual.</li>
                                <li>Mantener, proteger y mejorar las herramientas técnicas del simulador.</li>
                                <li>Enviar notificaciones administrativas o restablecer contraseñas si el usuario lo solicita.</li>
                            </ul>
                            <p className="mt-2 font-semibold text-blue-500">Bajo ninguna circunstancia vendemos, alquilamos ni compartimos sus datos personales con terceras empresas con fines comerciales o publicitarios.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">3. Seguridad de los Datos</h2>
                            <p>Implementamos medidas de seguridad técnicas y organizativas adecuadas para proteger sus datos personales contra accesos no autorizados, alteraciones, divulgación o destrucción. Esto incluye la encriptación de contraseñas mediante algoritmos hash seguros y el uso de conexiones protegidas por HTTPS.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">4. Uso de Cookies</h2>
                            <p>Utilizamos cookies propias que son estrictamente necesarias para el funcionamiento del sitio (por ejemplo, para identificar que ha iniciado sesión). No utilizamos cookies de rastreo de terceros para publicidad invasiva. Puede configurar su navegador para bloquear las cookies, pero es posible que algunas partes del simulador dejen de funcionar correctamente.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">5. Derechos del Usuario (Acceso, Rectificación y Eliminación)</h2>
                            <p>Como usuario, usted tiene pleno derecho a acceder a los datos personales que almacenamos, corregir cualquier información errónea o solicitar la eliminación definitiva de su cuenta y todo su historial de simulación. Para ejercer cualquiera de estos derechos, puede ponerse en contacto con nosotros a través de nuestro correo de soporte.</p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-3">6. Contacto</h2>
                            <p>Si tiene alguna pregunta, duda o inquietud respecto a esta Política de Privacidad o al manejo de sus datos dentro del simulador, puede escribirnos a la siguiente dirección de correo electrónico: <span className="underline text-blue-500">soporte@tusimulador.com</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}