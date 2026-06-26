import { API_URL } from './api';

export async function getTransacciones(pagina: number = 1, tipoFiltro?: string, search?: string, fechaInicio?: string, fechaFin?: string) {
    const params = new URLSearchParams({ page: String(pagina) });
    if (tipoFiltro && tipoFiltro !== 'TODOS') params.append('tipoTransaccion', tipoFiltro);
    if (search) params.append('search', search);
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);

    const response = await fetch(`${API_URL}/transaccion?${params.toString()}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener transacciones');
    
    return response.json();
}

export async function getUserTransacciones(pagina: number = 1, tipoFiltro?: string, search?: string, fechaInicio?: string, fechaFin?: string) {
    const params = new URLSearchParams({ page: String(pagina) });
    if (tipoFiltro && tipoFiltro !== 'TODOS') params.append('tipoTransaccion', tipoFiltro);
    if (search) params.append('search', search);
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);

    const response = await fetch(`${API_URL}/transaccion/historial?${params.toString()}`, { credentials: 'include' });
    if (!response.ok) throw new Error('Error al obtener transacciones');
    
    return response.json();
}