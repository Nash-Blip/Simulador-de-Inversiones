import { Inversor } from "@/inversor/entities/inversor.entity";
import { TenenciaActivo } from "@/tenenciaActivo/tenenciaActivo.entity";
import { Transaccion } from "@/transaccion/transaccion.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Portafolio {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'decimal',precision: 20,scale: 2,
        transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
        }
    })
    valorPortafolio!: number;

    @OneToMany(() => Transaccion, (transaccion) => transaccion.portafolio, { cascade: true })
    transacciones!: Transaccion[];

    @OneToMany(() => TenenciaActivo, (tenencia) => tenencia.portafolio, { cascade: true })
    tenencias!: TenenciaActivo[];

    @OneToOne(() => Inversor, (inversor) => inversor.portafolio)
    inversor!: Inversor;
}
