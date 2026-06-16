import { ApiProperty } from '@nestjs/swagger';
import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TipoTransaccion {
    COMPRA = 'COMPRA',
    VENTA = 'VENTA',
}

@Entity()
export class Transaccion {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID único de la transacción' })
    id!: number;

    @Column({ type: 'enum', enum: TipoTransaccion, })
    @ApiProperty({ enum: TipoTransaccion, description: 'Tipo de transacción' })
    tipoTransaccion!: TipoTransaccion;

    @Column({
        type: 'decimal', precision: 20, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 10, description: 'Cantidad de unidades operadas' })
    cantidad!: number;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 155.50, description: 'Precio al que se ejecutó la transacción' })
    precioEjecutado!: number;

    @CreateDateColumn()
    @ApiProperty({ example: '2026-06-11T12:00:00.000Z', description: 'Fecha de la transacción' })
    fecha!: Date;

    @ManyToOne(() => Portafolio, (portafolio) => portafolio.transacciones, { nullable: true })
    @ApiProperty({ type: () => Portafolio, nullable: true, description: 'Portafolio asociado' })
    portafolio!: Portafolio | null;

    @ManyToOne(() => Activo, (activo) => activo.transacciones)
    @ApiProperty({ type: () => Activo, description: 'Activo involucrado' })
    activo!: Activo;
}
