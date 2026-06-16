import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
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
    @ApiProperty({ example: 1, description: 'ID único del inversor' })
    id!: number;

    @Column({ unique: true })
    @ApiProperty({ example: 'usuario@mail.com', description: 'Email del inversor' })
    email!: string;

    @Column()
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del inversor' })
    nombre!: string;

    @Column()
    @Exclude()
    @ApiHideProperty()
    password!: string;

    @Column({
        type: 'enum',
        enum: InversorRol,
        default: InversorRol.USER,
    })
    @ApiProperty({ enum: InversorRol, description: 'Rol del inversor' })
    rol!: InversorRol;

    @Column({
        type: 'decimal', precision: 12, scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        }
    })
    @ApiProperty({ example: 10000.00, description: 'Saldo virtual del inversor' })
    saldoVirtual!: number;

    @OneToOne(() => Portafolio, (portfolio) => portfolio.inversor, { cascade: true, eager: true })
    @JoinColumn()
    @ApiProperty({ type: () => Portafolio, description: 'Portafolio del inversor' })
    portafolio!: Portafolio;
}

