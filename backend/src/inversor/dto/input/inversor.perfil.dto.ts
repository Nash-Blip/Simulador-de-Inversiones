import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class InversorPerfilDto {
    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del inversor' })
    @IsString()
    nombre!: string;
    
    @ApiProperty({ example: 'usuario@mail.com', description: 'Email del inversor' })
    @IsEmail()
    email!: string;
}