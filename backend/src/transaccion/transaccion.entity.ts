import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaccion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'decimal' })
    cantidad!: number;

    @Column({ type: 'decimal' })
    precioEjecutado!: number;

    @CreateDateColumn()
    fecha!: Date;

    @ManyToOne(() => Portafolio, (portafolio) => portafolio.transacciones)
    portafolio!: Portafolio;

    @ManyToOne(() => Activo, (activo) => activo.transacciones)
    activo!: Activo;

}
