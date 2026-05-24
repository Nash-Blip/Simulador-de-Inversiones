import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

export enum InversorRol {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity()
export class Inversor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    nombre!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({
        type: 'enum',
        enum: InversorRol,
        default: InversorRol.USER,
    })
    rol!: InversorRol;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    saldoVirtual!: number;

    @OneToOne(() => Portafolio, (portfolio) => portfolio.inversor, { cascade: true, eager: true })
    @JoinColumn()
    portafolio!: Portafolio;
}

