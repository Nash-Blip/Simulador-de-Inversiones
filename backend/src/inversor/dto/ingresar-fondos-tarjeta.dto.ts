import { IsNumber, IsString, Min } from "class-validator";

export class IngresarFondosTarjetaDto {

    @IsNumber()
    @Min(1)
    monto!: number;

    @IsString()
    numeroTarjeta!: string;

    @IsString()
    cvv!: string;

    @IsString()
    vencimiento!: string;
}