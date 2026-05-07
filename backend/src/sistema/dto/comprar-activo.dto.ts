import { IsNotEmpty, IsNumber } from "class-validator";

export class ComprarActivoDTO {
    @IsNumber()
    @IsNotEmpty()
    idActivo!: number;

    @IsNumber()
    @IsNotEmpty()
    idInversor!: number;
    
    @IsNumber()
    @IsNotEmpty()
    cantidad!: number;
}