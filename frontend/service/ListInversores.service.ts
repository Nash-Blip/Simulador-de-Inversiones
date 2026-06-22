'use client';
import { API_URL } from './api';
import { Inversor } from '@/types/index';

export async function getInversores(): Promise<Inversor[]> {
    const response = await fetch(`${API_URL}/inversor`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );
    if (!response.ok){
        const data = await response.json();
        throw new Error(data.message || "Error al obtener inversores");
    }
    return response.json();
}