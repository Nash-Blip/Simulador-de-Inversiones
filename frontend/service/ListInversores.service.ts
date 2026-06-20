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
    if (!response.ok) throw new Error('Error al obtener inversores');
    return response.json();
}