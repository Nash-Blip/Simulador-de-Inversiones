import { IsString, IsNumber, Min } from "class-validator";

export class CreateActivoDto { 

    @IsString()
    nombre!: string

    @IsString()
    ticker!: string

    @IsNumber()
    @Min(0)    
    precioInicial!: number

}
