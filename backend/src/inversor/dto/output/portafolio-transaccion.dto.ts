import { ApiProperty } from '@nestjs/swagger';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';

export class PortafolioTransaccionDto {
  @ApiProperty({ example: 1, description: 'ID de la transacción' })
  id!: number;

  @ApiProperty({ enum: TipoTransaccion, description: 'Tipo de transacción' })
  tipoTransaccion!: TipoTransaccion;

  @ApiProperty({ example: 3, description: 'Cantidad de unidades operadas' })
  cantidad!: number;

  @ApiProperty({ example: 613.41, description: 'Precio al que se ejecutó' })
  precioEjecutado!: number;

  @ApiProperty({ example: '2026-06-08T03:08:41.046Z', description: 'Fecha de la transacción' })
  fecha!: Date;
}
