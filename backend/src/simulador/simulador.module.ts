import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimuladorService } from './simulador'; // Ajustá la ruta a tu servicio
import { Activo } from '@/activo/entities/activo.entity';
import { Transaccion } from '@/transaccion/transaccion.entity';
import { ActivoModule } from '@/activo/activo.module'; // Importamos para usar ActivoService

@Module({
  imports: [TypeOrmModule.forFeature([Activo, Transaccion]),ActivoModule],
  providers: [SimuladorService],
})
export class SimuladorModule implements OnModuleInit {
  constructor(private readonly simuladorService: SimuladorService) {}
  onModuleInit() {}
}