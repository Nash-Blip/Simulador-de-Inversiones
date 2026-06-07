export enum TipoTransaccion {
    COMPRA,
    VENTA,
}

export type Transaccion = {
    id: number;
    tipoTransaccion: TipoTransaccion;
    cantidad: number;
    precioEjecutado: number;
    fecha: Date;
    portafolio: Portafolio | null;
    activo: Activo;
}

export type Activo = {
    id: number;
    nombre: string;
    ticker: string;
    precioActual: number;
}

export type TenenciaActivo = {
    id: number;
    cantidad: number;
    portafolio: Portafolio;
    activo: Activo;
}

export type Portafolio = {
    id: number;
    valorPortafolio: number;
    transacciones: Transaccion[];
    tenencias: TenenciaActivo[];
}

export type TransaccionHistorial = {
    id: number;
    tipoTransaccion: TipoTransaccion;
    cantidad: number;
    precioEjecutado: number;
    fecha: Date;
    ticker: string | null;
}