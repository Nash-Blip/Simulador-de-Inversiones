import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsString } from "class-validator";

export class IngresarFondosTarjetaDto {
    @ApiProperty({ example: 500, description: 'Monto a ingresar' })
    @IsNumber()
    @IsPositive()
    monto!: number;

    @ApiProperty({ example: '4111111111111111', description: 'Número de tarjeta' })
    @IsString()
    numeroTarjeta!: string;

    @ApiProperty({ example: '123', description: 'CVV de la tarjeta' })
    @IsString()
    cvv!: string;

    @ApiProperty({ example: '12/28', description: 'Fecha de vencimiento' })
    @IsString()
    vencimiento!: string;
}