import { ApiProperty } from '@nestjs/swagger';
import { InversorRol } from '@/inversor/entities/inversor.entity';

class PortafolioResumidoDto {
  @ApiProperty({ example: 1, description: 'ID único del portafolio' })
  id!: number;

  @ApiProperty({ example: 2023.59, description: 'Costo total del portafolio' })
  costoPortafolio!: number;
}

export class InversorListItemDto {
  @ApiProperty({ example: 1, description: 'ID único del inversor' })
  id!: number;

  @ApiProperty({ example: 'usuario@mail.com', description: 'Email del inversor' })
  email!: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del inversor' })
  nombre!: string;

  @ApiProperty({ enum: InversorRol, description: 'Rol del inversor' })
  rol!: InversorRol;

  @ApiProperty({ example: 7978.75, description: 'Saldo virtual del inversor' })
  saldoVirtual!: number;

  @ApiProperty({ type: () => PortafolioResumidoDto, description: 'Portafolio del inversor' })
  portafolio!: PortafolioResumidoDto;
}
