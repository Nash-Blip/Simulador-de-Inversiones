import { ApiProperty } from '@nestjs/swagger';
import { PortafolioTransaccionDto } from './portafolio-transaccion.dto';
import { TenenciaResponseDto } from './tenencia-response.dto';
export class PortafolioResponseDto {
  @ApiProperty({ example: 7978.75, description: 'Saldo virtual del inversor' })
  saldoVirtual!: number;

  @ApiProperty({ example: 2, description: 'ID único del portafolio' })
  id!: number;

  @ApiProperty({ example: 2023.59, description: 'Costo total del portafolio' })
  costoPortafolio!: number;

  @ApiProperty({ type: () => [PortafolioTransaccionDto], description: 'Transacciones del portafolio' })
  transacciones!: PortafolioTransaccionDto[];

  @ApiProperty({ type: () => [TenenciaResponseDto], description: 'Tenencias con rendimiento' })
  tenencias!: TenenciaResponseDto[];

  @ApiProperty({ example: 2024.35, description: 'Valor actual total del portafolio' })
  valorPortafolio!: number;

  @ApiProperty({ example: 0.04, description: 'Rendimiento porcentual del portafolio' })
  rendimientoPortafolio!: number;
}
