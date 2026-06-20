import { API_URL } from './api';
import { Perfil, Portafolio } from '@/types/index';
export async function getPerfil(): Promise<Perfil> {
    const response = await fetch(`${API_URL}/inversor/perfil`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    });
    if (response.ok){
        return response.json();
    } else{
        throw new Error('Error al obtener perfil');
    }
}