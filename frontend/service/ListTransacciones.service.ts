import { API_URL } from './api';

export async function getTransacciones(pagina: number = 1, tipoFiltro?: string) {
    let url = `${API_URL}/transaccion?page=${pagina}`;

    if (tipoFiltro && tipoFiltro !== 'TODOS') {
        url += `&tipoTransaccion=${tipoFiltro}`;
    }

    const response = await fetch(url, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener transacciones');
    
    return response.json();
}