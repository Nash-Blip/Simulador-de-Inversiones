import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateActivoDto {
    @IsString()
    @IsNotEmpty()
    nombre!: string;
    
    @IsString()
    @IsNotEmpty()
    ticker!: string;
    
    @IsNumber()
    @IsPositive()
    precioActual!: number;
}
