import { ApiProperty } from '@nestjs/swagger';

export class PortafolioActivoDto {
  @ApiProperty({ example: 1, description: 'ID único del activo' })
  id!: number;

  @ApiProperty({ example: 'Tesla Inc.', description: 'Nombre del activo' })
  nombre!: string;

  @ApiProperty({ example: 'TSLA', description: 'Ticker del activo' })
  ticker!: string;

  @ApiProperty({ example: 402.11, description: 'Precio inicial del activo' })
  precioInicial!: number;

  @ApiProperty({ example: 404.87, description: 'Precio actual del activo' })
  precioActual!: number;

  @ApiProperty({ example: 404.87, description: 'Valor máximo histórico' })
  valorMaximo!: number;

  @ApiProperty({ example: 402.03, description: 'Valor mínimo histórico' })
  valorMinimo!: number;

  @ApiProperty({ example: 97, description: 'Cantidad de operaciones realizadas' })
  cantOperaciones!: number;

  @ApiProperty({ example: 38552.36, description: 'Total ejecutado en operaciones' })
  totalEjecutado!: number;
}
