import { IsNumber, IsPositive } from "class-validator";

export class CompraActivoDto {
    @IsNumber()
    activoId!: number;

    @IsNumber()
    @IsPositive()
    cantidad!: number;
}