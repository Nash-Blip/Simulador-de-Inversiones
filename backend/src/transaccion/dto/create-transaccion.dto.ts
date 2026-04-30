import { IsDateString, IsEnum, IsNumber, IsPositive, IsString } from "class-validator";
import { TipoTransaccion } from "../entities/transaccion.entity";

export class CreateTransaccionDto {
    @IsString()
    ticker!: string;

    @IsEnum(TipoTransaccion)
    tipo!: TipoTransaccion;

    @IsNumber()
    @IsPositive()
    cantidad!: number;

    @IsNumber()
    @IsPositive()
    precioEjecutado!: number;

    @IsNumber()
    portafolioId!: number;
}
