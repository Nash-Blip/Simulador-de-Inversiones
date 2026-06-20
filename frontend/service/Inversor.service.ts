import { API_URL } from './api';
import { Perfil } from '@/types/index';

export async function getPerfil(): Promise<Perfil> {
    const response = await fetch(`${API_URL}/inversor/perfil`, {
        method: 'GET',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Error al obtener perfil');
    return response.json();
}