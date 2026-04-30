import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Transaccion } from "../../transaccion/entities/transaccion.entity";

@Entity()
export class Portafolio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    valorPortafolio!: number;

    @OneToMany(() => Transaccion, (transaccion) => transaccion.portafolio)
    transacciones!: Transaccion[];
}