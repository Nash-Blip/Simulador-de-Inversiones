import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoTransaccion } from '../../transaccion.entity';

export class GetTransaccionesQueryDto {
    @ApiProperty({ example: 1, required: false, description: 'Número de página' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ example: 'AAPL', required: false, description: 'Búsqueda por ticker o nombre' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ enum: TipoTransaccion, required: false, description: 'Filtrar por tipo de transacción (COMPRA o VENTA)' })
    @IsOptional()
    @IsEnum(TipoTransaccion, {
        message: 'El tipo debe ser COMPRA o VENTA',
    })
    tipoTransaccion?: TipoTransaccion;

    @ApiProperty({ example: '2026-01-01', required: false, description: 'Fecha inicio (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    fechaInicio?: string;

    @ApiProperty({ example: '2026-12-31', required: false, description: 'Fecha fin (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;
}
