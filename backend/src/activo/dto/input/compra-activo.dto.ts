import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from "class-validator";

export class CompraActivoDto {
    @ApiProperty({ example: 1, description: 'ID del activo' })
    @IsNumber()
    activoId!: number;

    @ApiProperty({ example: 10, description: 'Cantidad de unidades' })
    @IsNumber()
    @IsPositive()
    cantidad!: number;
}