import { IsNumber } from "class-validator";

export class VenderActivoDto { 

    @IsNumber()
    activoId!: number

    @IsNumber()
    cantidad!: number    

}
