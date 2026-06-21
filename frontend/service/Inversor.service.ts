import { API_URL } from './api';
import { Perfil, Inversor } from '@/types/index';

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

export async function getInversor(): Promise<Inversor>{
    const response = await fetch(`${API_URL}/inversor/perfil`, 
        {
            method: 'GET',
            credentials: 'include'
        }
    );
    if(response.ok){
        return response.json();
    } else{
        throw new Error('Error al obtener los datos de inversor')
    }
}