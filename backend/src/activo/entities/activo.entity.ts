import { Transaccion } from "@/transaccion/transaccion.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Activo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    ticker!: string;

    @Column({type: 'decimal',precision: 12,scale: 2,
        transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
        }
    })
    precioActual!: number;

    @OneToMany(() => Transaccion, (t) => t.activo)
    transacciones!: Transaccion[];
}
