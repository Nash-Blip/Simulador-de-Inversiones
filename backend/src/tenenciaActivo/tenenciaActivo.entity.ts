import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TenenciaActivo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  cantidad!: number;

  // Relación con el Portafolio
  @ManyToOne(() => Portafolio, (portafolio) => portafolio.tenencias)
  portafolio!: Portafolio;

  // Relación con el Activo
  @ManyToOne(() => Activo)
  activo!: Activo;
}