import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { InversorRol } from '@/inversor/entities/inversor.entity';

export class InversorPerfilDto {
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del inversor' })
    @IsString()
    nombre!: string;
    
    @ApiProperty({ example: 'usuario@mail.com', description: 'Email del inversor' })
    @IsEmail()
    email!: string;

    @IsNumber()
    saldo!: number;

    @ApiProperty({ enum: InversorRol, example: InversorRol.USER, description: 'Rol del inversor' })
    @IsEnum(InversorRol)
    rol!: InversorRol;
}