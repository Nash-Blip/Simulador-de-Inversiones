import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TipoTransaccion {
    COMPRA,
    VENTA,
}

@Entity()
export class Transaccion {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'enum', enum: TipoTransaccion,})
    tipoTransaccion!: TipoTransaccion;
    
    @Column({type: 'decimal',precision: 20,scale: 2,
        transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
        }
    })
    cantidad!: number;

    @Column({type: 'decimal',precision: 12,scale: 2,
        transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
        }
    })
    precioEjecutado!: number;

    @CreateDateColumn()
    fecha!: Date;

    @ManyToOne(() => Portafolio, (portafolio) => portafolio.transacciones, {nullable: true})
    portafolio!: Portafolio | null;

    @ManyToOne(() => Activo, (activo) => activo.transacciones)
    activo!: Activo;
}
