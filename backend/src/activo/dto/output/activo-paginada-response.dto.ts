import { ApiProperty } from '@nestjs/swagger';
import { ActivoListItemDto } from './activo-list-item.dto';

class MetaDto {
    @ApiProperty({ example: 25, description: 'Total de activos' })
    totalItems!: number;

    @ApiProperty({ example: 8, description: 'Cantidad en esta página' })
    itemCount!: number;

    @ApiProperty({ example: 8, description: 'Items por página' })
    itemsPerPage!: number;

    @ApiProperty({ example: 4, description: 'Total de páginas' })
    totalPages!: number;

    @ApiProperty({ example: 1, description: 'Página actual' })
    currentPage!: number;
}

export class ActivosPaginadaResponseDto {
    @ApiProperty({ type: () => [ActivoListItemDto], description: 'Lista de activos' })
    data!: ActivoListItemDto[];

    @ApiProperty({ type: () => MetaDto, description: 'Metadatos de paginación' })
    meta!: MetaDto;
}