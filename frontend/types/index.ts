export enum TipoTransaccion {
    COMPRA,
    VENTA,
}

export enum InversorRol {
    USER = 'user',
    ADMIN = 'admin',
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
    rendimiento: number;
    id: number;
    cantidad: number;
    precioCompra: number;
    portafolio: Portafolio;
    activo: Activo;
}

export type Portafolio = {
    id: number;
    valorPortafolio: number;
    costoPortafolio: number;
    rendimientoPortafolio: number;
    saldoVirtual: number;
    transacciones: Transaccion[];
    tenencias: TenenciaActivo[];
    inversor: Inversor;
}

export type Inversor = {
    id: number;
    email: string;
    nombre:string;
    rol: InversorRol;
    saldoVirtual: number;
}

export type TransaccionHistorial = {
    id: number;
    tipoTransaccion: TipoTransaccion;
    cantidad: number;
    precioEjecutado: number;
    fecha: Date;
    ticker: string | null;
}

export type Perfil = {
    nombre: string;
    email: string;
}