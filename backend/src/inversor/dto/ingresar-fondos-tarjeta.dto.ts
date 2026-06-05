import { IsNumber, IsPositive, IsString } from "class-validator";

export class IngresarFondosTarjetaDto {
    @IsNumber()
    @IsPositive()
    monto!: number;

    @IsString()
    numeroTarjeta!: string;

    @IsString()
    cvv!: string;

    @IsString()
    vencimiento!: string;
}