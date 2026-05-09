import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Inversor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({type: 'decimal',precision: 12,scale: 2,
        transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
        }
    })
    saldoVirtual!: number;

    @OneToOne(() => Portafolio, (portfolio) => portfolio.inversor, { cascade: true,eager: true })
    @JoinColumn()
    portafolio!: Portafolio;
}
