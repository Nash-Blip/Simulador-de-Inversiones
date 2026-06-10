import Link from "next/link";

export default function FondoOptions() {
    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
            <div className="w-fit bg-gray-700 rounded-xl border border-green-500 p-6 flex flex-col gap-3">
                <h1 className="text-xl font-bold text-white mb-4 flex flex-col gap-3">Seleccione medio de pago</h1>
                <div className="flex gap-3">
                    <Link href="/fondos/tarjeta"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer">
                        Tarjeta
                    </Link>
                    <Link href="/fondos/transferencia"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer">
                        Transferencia
                    </Link>
                </div>
                <h2 className="text-xl font-bold text-white mb-4 flex flex-col gap-3">Retire su dinero</h2>
                <Link href="/fondos/retirar"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer block w-full text-center">
                    Retirar
                </Link>
            </div>
        </div>
    )
}