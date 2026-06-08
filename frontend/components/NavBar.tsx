import Link from 'next/link';

export default function NavBar(){


    return(
        <div>
            <Link href="/" className="text-green-400 hover:text-black">Inicio</Link>
            <Link href="/inversor" className="text-green-400 hover:text-black">Perfil</Link>
            <Link href="/activos" className="text-green-400 hover:text-black">Activos</Link>
            <Link href="/transacciones" className="text-green-400 hover:text-black">Historial de transacciones</Link>
        </div>
    )
}