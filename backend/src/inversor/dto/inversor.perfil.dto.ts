import { IsEmail, IsString } from "class-validator";

export class InversorPerfilDto {
    @IsString()
    nombre!: string;
    
    @IsEmail()
    email!: string;
}