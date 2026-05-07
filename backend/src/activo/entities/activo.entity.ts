import  { Transaccion }  from "@/transaccion/entities/transaccion.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Activo {
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column()
    nombre!: string
    
    @Column({ unique: true })
    simbolo!: string

    @Column()
    precio!: number

    @Column()
    precioInicial!: number

    @Column()
    variacion!: number

    @OneToMany(() => Transaccion, (t) => t.activos)
    transacciones!: Transaccion[]

}