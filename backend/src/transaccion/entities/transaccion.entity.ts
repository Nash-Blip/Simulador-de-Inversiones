import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { Portafolio } from "../../portafolio/entities/portafolio.entity";
import { Activo } from "../../activo/entities/activo.entity";

export enum TipoTransaccion {
    COMPRA = "COMPRA",
    VENTA = "VENTA",
}

@Entity()
export class Transaccion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    ticker!: string;

    @Column({ type: "enum", enum: TipoTransaccion })
    tipo!: TipoTransaccion;

    @Column("decimal", { precision: 10, scale: 2 })
    cantidad!: number;

    @Column("decimal", { precision: 10, scale: 2 })
    precioEjecutado!: number;

    @CreateDateColumn({ type: "timestamp" })
    fecha!: Date;

    @ManyToOne(() => Portafolio, (portafolio) => portafolio.transacciones)
    portafolio!: Portafolio;

    @ManyToOne(() => Activo, (activo) => activo.transacciones)
    activo!: Portafolio;
}

