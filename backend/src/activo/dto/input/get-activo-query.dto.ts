import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetActivosQueryDto {
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
}