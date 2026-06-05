// src/transaccion/dto/get-transacciones-query.dto.ts
import { IsOptional, IsEnum, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoTransaccion } from '../transaccion.entity';

export class GetTransaccionesQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1; // El único parámetro de paginación que viene del Front

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(TipoTransaccion, {
        message: 'El tipo debe ser COMPRA o VENTA',
    })
    tipoTransaccion?: TipoTransaccion;

    @IsOptional()
    @IsDateString()
    fechaInicio?: string;

    @IsOptional()
    @IsDateString()
    fechaFin?: string;
}