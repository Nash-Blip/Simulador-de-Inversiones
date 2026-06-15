import { ApiProperty } from '@nestjs/swagger';
import { ActivoTransaccionDto } from './activo-transaccion.dto';

export class ActivoDetailDto {
  @ApiProperty({ example: 1, description: 'ID único del activo' })
  id!: number;

  @ApiProperty({ example: 'NVIDIA Corporation', description: 'Nombre del activo' })
  nombre!: string;

  @ApiProperty({ example: 'NVDA', description: 'Ticker del activo' })
  ticker!: string;

  @ApiProperty({ example: 204.92, description: 'Precio inicial del activo' })
  precioInicial!: number;

  @ApiProperty({ example: 204.92, description: 'Precio actual del activo' })
  precioActual!: number;

  @ApiProperty({ example: 204.92, description: 'Valor máximo histórico' })
  valorMaximo!: number;

  @ApiProperty({ example: 204.92, description: 'Valor mínimo histórico' })
  valorMinimo!: number;

  @ApiProperty({ example: 155, description: 'Cantidad de operaciones realizadas' })
  cantOperaciones!: number;

  @ApiProperty({ example: 31935.38, description: 'Total ejecutado en operaciones' })
  totalEjecutado!: number;

  @ApiProperty({ type: () => [ActivoTransaccionDto], description: 'Transacciones del activo' })
  transacciones!: ActivoTransaccionDto[];
}
