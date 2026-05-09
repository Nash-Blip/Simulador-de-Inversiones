import { Inversor } from "@/inversor/entities/inversor.entity";
import { Transaccion } from "@/transaccion/transaccion.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Portafolio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    valorPortafolio!: number;

    @OneToMany(() => Transaccion, (transaccion) => transaccion.portafolio, {cascade: true})
    transacciones!: Transaccion[];

    @OneToOne(() => Inversor, (inversor) => inversor.portafolio)
    inversor!: Inversor;
}
