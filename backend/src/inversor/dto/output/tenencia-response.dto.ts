import { ApiProperty } from '@nestjs/swagger';
import { PortafolioActivoDto } from './portafolio-activo.dto';

export class TenenciaResponseDto {
  @ApiProperty({ example: 1, description: 'ID único de la tenencia' })
  id!: number;

  @ApiProperty({ example: 5, description: 'Cantidad de unidades del activo' })
  cantidad!: number;

  @ApiProperty({ example: 404.718, description: 'Precio de compra por unidad' })
  precioCompra!: number;

  @ApiProperty({ example: 0.04, description: 'Rendimiento porcentual de la tenencia' })
  rendimiento!: number;

  @ApiProperty({ type: () => PortafolioActivoDto, description: 'Activo asociado' })
  activo!: PortafolioActivoDto;
}
