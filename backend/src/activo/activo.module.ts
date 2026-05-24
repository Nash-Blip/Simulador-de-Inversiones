import { Module } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { ActivoController } from './activo.controller';
import { Sistema } from '@/sistema/sistema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { Inversor } from '@/inversor/entities/inversor.entity';
import { TenenciaActivo } from '@/tenenciaActivo/tenenciaActivo.entity';
import { Transaccion } from '@/transaccion/transaccion.entity';
import { Portafolio } from '@/portafolio/portafolio.entity';
import { InversorModule } from '@/inversor/inversor.module';


@Module({
  controllers: [ActivoController],
  providers: [ActivoService, Sistema],
  imports: [TypeOrmModule.forFeature([Activo,Inversor,TenenciaActivo,Transaccion,Portafolio,]),InversorModule],
  exports: [ActivoService],
})
export class ActivoModule {}
