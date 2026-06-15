import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateInversorDto {
    @ApiProperty({ example: 'usuario@mail.com', description: 'Email del inversor' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del inversor' })
    @IsString()
    nombre!: string;

    @ApiProperty({ example: '123456', description: 'Contraseña (mín. 6 caracteres)' })
    @IsString()
    @MinLength(6)
    password!: string;
}
