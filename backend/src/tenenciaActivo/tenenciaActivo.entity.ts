import { ApiProperty } from '@nestjs/swagger';
import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TenenciaActivo {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'ID único de la tenencia' })
  id!: number;

  @Column({
    type: 'decimal', precision: 12, scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  @ApiProperty({ example: 15, description: 'Cantidad de unidades del activo' })
  cantidad!: number;

  @Column({
    type: 'decimal', precision: 14, scale: 6,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  @ApiProperty({ example: 150.00, description: 'Precio de compra por unidad' })
  precioCompra!: number;

  @ManyToOne(() => Portafolio, (portafolio) => portafolio.tenencias)
  @ApiProperty({ type: () => Portafolio, description: 'Portafolio al que pertenece' })
  portafolio!: Portafolio;

  @ManyToOne(() => Activo)
  @ApiProperty({ type: () => Activo, description: 'Activo asociado' })
  activo!: Activo;
}