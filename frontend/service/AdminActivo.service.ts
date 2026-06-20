import { API_URL } from "./api";
import { Activo } from '@/types/index';

export async function CreateActivo(nombre: string, ticker: string, precioInicial: number): Promise<Activo> {
    const response = await fetch(`${API_URL}/activo`,
        {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(
                {
                    nombre,
                    ticker,
                    precioInicial
                }
            )
        }
    );
    if (response.ok) {
        return response.json();
    } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el activo.')
    }
}

export async function ModificarActivo(id: number, nombre: string, ticker: string): Promise<Activo> {
    const response = await fetch(`${API_URL}/activo/${id}`,
        {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(
                {
                    nombre,
                    ticker
                }
            )
        }
    );
    if(response.ok){
        return response.json();
    } else{
        const data = await response.json();
        throw new Error(data.message || 'Error al modificar el activo.')
    }
}

export async function GetActivo(): Promise<Activo[]> {
    const response = await fetch(`${API_URL}/activo`, 
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    if(response.ok){
        return response.json();
    } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al obtener los activos existentes.')
    }
}