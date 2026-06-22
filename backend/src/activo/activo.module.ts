import { Module } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { ActivoController } from './activo.controller';
import { Sistema } from '@/sistema/sistema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { InversorModule } from '@/inversor/inversor.module';
import { TransaccionModule } from '@/transaccion/transaccion.module';
import { TenenciaModule } from '@/tenenciaActivo/tenencia.module';


@Module({
  controllers: [ActivoController],
  providers: [ActivoService, Sistema],
  imports: [TypeOrmModule.forFeature([Activo]),InversorModule,TransaccionModule,TenenciaModule],
  exports: [ActivoService],
})
export class ActivoModule {}
