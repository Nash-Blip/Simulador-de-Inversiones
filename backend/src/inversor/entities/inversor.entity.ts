import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Inversor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    saldoVirtual!: number;

    @OneToOne(() => Portafolio, (portfolio) => portfolio.inversor, {cascade: true,eager: true})
    portafolio!: Portafolio;
}
