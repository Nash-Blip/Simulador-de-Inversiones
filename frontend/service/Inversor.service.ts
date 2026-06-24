import { API_URL } from './api';
import { Perfil, Inversor, Portafolio } from '@/types/index';

export async function getPerfil(): Promise<Perfil> {
    const response = await fetch(`${API_URL}/inversor/perfil`, {
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener perfil");
    }
    return response.json();
}

export async function getInversor(): Promise<Inversor> {
    const response = await fetch(`${API_URL}/inversor/perfil`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener los datos de inversor");
    }
    return response.json();
}

export async function getPortafolio(): Promise<Portafolio> {
    const response = await fetch(`${API_URL}/inversor/portafolio`,
        {
            credentials: 'include'
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al obtener el portafolio");
    }
    return response.json();
}

export async function ingresarFondosTransferencia(monto: number, cbu: string, titular: string) {
    const response = await fetch(`${API_URL}/inversor/ingresar-fondos-transferencia`,
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ monto, cbu, titular })
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al ingresar fondos por transferencia.");
    }
    return response.json();
}

export async function ingresarFondosTarjeta(monto: number, numeroTarjeta: string, cvv: string, vencimiento: string) {
    const response = await fetch(`${API_URL}/inversor/ingresar-fondos-tarjeta`,
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ monto, numeroTarjeta, cvv, vencimiento })
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al ingresar fondos por tarjeta.");
    }
    return response.json();
}

export async function retirarFondos(monto: number, cbu: string, titular: string) {
    const response = await fetch(`${API_URL}/inversor/retirar-fondos`,
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ monto, cbu, titular })
        }
    );
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al retirar fondos.");
    }
    return response.json();
}

export async function cambiarPassword(actual: string, nueva: string) {
    const response = await fetch(`${API_URL}/inversor/cambiar-password`,
        {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                passwordActual: actual,
                passwordNueva: nueva
            }),
        }
    );
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Error al querer cambiar contraseña.")
    }

    return response.json();
}