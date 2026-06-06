"use client";
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("http://localhost:3000/auth/logout", {
            method: 'POST',
            credentials: 'include',
        });
        router.push('/auth/login');
    }

    return (
        <button onClick={handleLogout} className="bg-green-600 rounded-xl shadow p-2 text-sm text-white-400 hover:text-black transition-colors cursor-pointer">
            Cerrar sesión
        </button>
    );
}