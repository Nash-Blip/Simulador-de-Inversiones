import { ApiProperty } from "@nestjs/swagger";
import { Transaccion } from "@/transaccion/transaccion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Activo {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID único del activo' })
    id!: number;

    @Column()
    @ApiProperty({ example: 'Apple Inc.', description: 'Nombre del activo' })
    nombre!: string;

    @Column()
    @ApiProperty({ example: 'AAPL', description: 'Ticker del activo' })
    ticker!: string;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 150.50, description: 'Precio inicial del activo' })
    precioInicial!: number;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 155.75, description: 'Precio actual del activo' })
    precioActual!: number;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 200.00, description: 'Valor máximo histórico' })
    valorMaximo!: number;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 100.00, description: 'Valor mínimo histórico' })
    valorMinimo!: number;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 42, description: 'Cantidad de operaciones realizadas' })
    cantOperaciones!: number;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 6500.00, description: 'Total ejecutado en operaciones' })
    totalEjecutado!: number;

    @OneToMany(() => Transaccion, (t) => t.activo)
    @ApiProperty({ type: () => Transaccion, isArray: true, description: 'Transacciones del activo' })
    transacciones!: Transaccion[];
}
