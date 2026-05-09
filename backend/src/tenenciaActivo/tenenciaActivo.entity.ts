import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TenenciaActivo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type: 'decimal',precision: 12,scale: 2,
        transformer: {
        to: (value: number) => value,
        from: (value: string) => parseFloat(value),
        }
    })
  cantidad!: number;

  @ManyToOne(() => Portafolio, (portafolio) => portafolio.tenencias)
  portafolio!: Portafolio;

  @ManyToOne(() => Activo)
  activo!: Activo;
}