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
    if(response.ok){
        return response.json();
    } else{
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el activo.')
    }
}