import Link from "next/link";

export default function FondoOptions() {
    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center">
            <div className="w-fit bg-gray-700 rounded-xl border border-green-500 p-6 flex flex-col gap-3">
                <div className="flex gap-3">
                    <Link href="/admin/inversores"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer">
                        Lista de inversores
                    </Link>
                    <Link href="/admin/transacciones"
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer">
                        lista de transacciones
                    </Link>
                </div>
                <Link href="/admin/activos"
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors cursor-pointer block w-full text-center">
                    Crear Activo
                </Link>
            </div>
        </div>
    )
}