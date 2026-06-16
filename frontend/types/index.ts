export enum TipoTransaccion {
    COMPRA,
    VENTA,
}

export enum InversorRol {
    USER = "user",
    ADMIN = 'admin'    
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
    precioInicial: number;
    precioActual: number;
    valorMaximo: number;
    valorMinimo: number;
    cantOperaciones: number;
    totalEjecutado: number;
}

export type TenenciaActivo = {
    id: number;
    rendimiento: number;
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
    nombre: string;
    email: string;
    rol: InversorRol;
    saldo: number;
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