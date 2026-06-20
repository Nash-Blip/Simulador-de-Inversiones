import { API_URL } from './api';

export async function login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Credenciales incorrectas');
    return response.json();
}

export async function register(nombre: string, email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
    });
    if (!response.ok) throw new Error('Error al registrarse');
    return response.json();
}

export async function logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al cerrar sesión');
}   