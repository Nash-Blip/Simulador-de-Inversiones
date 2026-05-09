import { IsNumber, IsPositive } from "class-validator";

export class CompraActivoDto {
    @IsNumber()
    inversorId!: number;

    @IsNumber()
    activoId!: number;

    @IsNumber()
    @IsPositive()
    cantidad!: number;
}