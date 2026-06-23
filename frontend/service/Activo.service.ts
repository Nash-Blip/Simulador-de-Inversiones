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
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el activo.')
    }
    return response.json();
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
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al modificar el activo.')
    }
    return response.json();
}

export async function getListActivos(): Promise<Activo[]> {
    const response = await fetch(`${API_URL}/activo`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al obtener los activos.');
    }
    const json = await response.json();
    return json.data;
}

export async function getActivosPaginados(pagina: number = 1){
    const response = await fetch(`${API_URL}/activo?page=${pagina}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al obtener los activos existentes.');
    }
    return response.json();
}

export async function getActivo(): Promise<Activo[]> {
    const response = await fetch(`${API_URL}/activo/list`,
        {
            credentials: 'include'
        }
    );

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al obtener los activos existentes.');
    }
    return response.json();
}

export async function getActivoById(id: string | number): Promise<Activo> {
    const response = await fetch(`${API_URL}/activo/${id}`,
        {
            credentials: 'include'
        }
    );
    if (!response.ok) {
        throw new Error("Error al obtener activo.");
    }
    return response.json();
}

export async function comprarActivo(id: number, cantidad: number) {
    const response = await fetch(`${API_URL}/activo/comprar`,
        {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ activoId: id, cantidad }),
            credentials: 'include'
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No se pudo comprar el Activo seleccionado.");
    }
    return response.json();
}

export async function venderActivo(vender: Activo, cantidad: number) {
    const response = await fetch(`${API_URL}/activo/vender`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activoId: vender.id, cantidad })
    });
    if(!response.ok){
        const data = await response.json();
        throw new Error(data.message || "No se pudo vender el activo seleccionado.");
    }
    return response.json();
}