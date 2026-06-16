import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimuladorService } from './simulador';
import { Activo } from '@/activo/entities/activo.entity';
import { ActivoModule } from '@/activo/activo.module';
import { TransaccionModule } from '@/transaccion/transaccion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activo]),ActivoModule,TransaccionModule],
  providers: [SimuladorService],
})
export class SimuladorModule {}