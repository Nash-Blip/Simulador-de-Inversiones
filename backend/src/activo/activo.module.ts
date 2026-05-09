import { Module } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { ActivoController } from './activo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { Transaccion } from '@/transaccion/transaccion.entity';
import { TenenciaActivo } from '@/tenenciaActivo/tenenciaActivo.entity';
import { Sistema } from '@/sistema/sistema';

@Module({
  controllers: [ActivoController],
  providers: [ActivoService, Sistema],
  imports: [TypeOrmModule.forFeature([Activo, Transaccion, TenenciaActivo])],
})
export class ActivoModule {}
