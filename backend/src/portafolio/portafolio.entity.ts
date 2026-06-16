import { ApiProperty } from '@nestjs/swagger';
import { Inversor } from "@/inversor/entities/inversor.entity";
import { TenenciaActivo } from "@/tenenciaActivo/tenenciaActivo.entity";
import { Transaccion } from "@/transaccion/transaccion.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Portafolio {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'ID único del portafolio' })
    id!: number;

    @Column({
        type: 'decimal', precision: 20, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 5000.00, description: 'Costo total del portafolio' })
    costoPortafolio!: number;

    @OneToMany(() => Transaccion, (transaccion) => transaccion.portafolio, { cascade: true })
    @ApiProperty({ type: () => Transaccion, isArray: true, description: 'Transacciones del portafolio' })
    transacciones!: Transaccion[];

    @OneToMany(() => TenenciaActivo, (tenencia) => tenencia.portafolio, { cascade: true })
    @ApiProperty({ type: () => TenenciaActivo, isArray: true, description: 'Tenencias del portafolio' })
    tenencias!: TenenciaActivo[];

    @OneToOne(() => Inversor, (inversor) => inversor.portafolio)
    @ApiProperty({ type: () => Inversor, description: 'Inversor propietario' })
    inversor!: Inversor;
}
