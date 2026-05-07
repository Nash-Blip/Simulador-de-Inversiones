import { IsNumber } from "class-validator";

export class ComprarActivoDto { 

    @IsNumber()
    activoId!: number

    @IsNumber()
    cantidad!: number    

}
