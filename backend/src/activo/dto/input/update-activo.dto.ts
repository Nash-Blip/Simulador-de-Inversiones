import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateActivoDto {
  @ApiProperty({ example: 'Apple Inc.', description: 'Nombre del activo' })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({ example: 'AAPL', description: 'Ticker del activo' })
  @IsString()
  @IsNotEmpty()
  ticker!: string;
}