import { ApiProperty } from '@nestjs/swagger';
import { TipoTransaccion } from '../../transaccion.entity';

export class TransaccionItemDto {
  @ApiProperty({ example: 1, description: 'ID de la transacción' })
  id!: number;

  @ApiProperty({ enum: TipoTransaccion, description: 'Tipo de transacción' })
  tipoTransaccion!: TipoTransaccion;

  @ApiProperty({ example: 10, description: 'Cantidad de unidades operadas' })
  cantidad!: number;

  @ApiProperty({ example: 155.50, description: 'Precio al que se ejecutó' })
  precioEjecutado!: number;

  @ApiProperty({ example: '2026-06-11T12:00:00.000Z', description: 'Fecha de la transacción' })
  fecha!: Date;

  @ApiProperty({ example: 'AAPL', nullable: true, description: 'Ticker del activo' })
  ticker!: string | null;
}
