import { ApiProperty } from '@nestjs/swagger';
import { TransaccionItemDto } from './transaccion-item.dto';

class MetaDto {
  @ApiProperty({ example: 25, description: 'Total de transacciones' })
  totalItems!: number;

  @ApiProperty({ example: 10, description: 'Cantidad en esta página' })
  itemCount!: number;

  @ApiProperty({ example: 10, description: 'Items por página' })
  itemsPerPage!: number;

  @ApiProperty({ example: 3, description: 'Total de páginas' })
  totalPages!: number;

  @ApiProperty({ example: 1, description: 'Página actual' })
  currentPage!: number;
}

export class TransaccionPaginadaResponseDto {
  @ApiProperty({ type: () => [TransaccionItemDto], description: 'Lista de transacciones' })
  data!: TransaccionItemDto[];

  @ApiProperty({ type: () => MetaDto, description: 'Metadatos de paginación' })
  meta!: MetaDto;
}
