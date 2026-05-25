import { IsEmail, IsNumber, IsString, IsEnum, IsOptional, MinLength } from "class-validator";
import { InversorRol } from "../entities/inversor.entity";

export class CreateInversorDto {
    @IsEmail()
    email!: string;

    @IsString()
    nombre!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    // @IsOptional()
    // @IsEnum(InversorRol)
    // rol?: InversorRol;
}
