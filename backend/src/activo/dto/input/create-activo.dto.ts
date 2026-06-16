import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateActivoDto {
    @ApiProperty({ example: 'Apple Inc.', description: 'Nombre del activo' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
    
    @ApiProperty({ example: 'AAPL', description: 'Ticker del activo' })
    @IsString()
    @IsNotEmpty()
    ticker!: string;
    
    @ApiProperty({ example: 150.50, description: 'Precio inicial del activo' })
    @IsNumber()
    @IsPositive()
    precioInicial!: number;
}
