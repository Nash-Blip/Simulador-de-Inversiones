import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenenciaService } from './tenencia.service';
import { TenenciaActivo } from './tenenciaActivo.entity';


@Module({
  imports: [TypeOrmModule.forFeature([TenenciaActivo])],
  providers: [TenenciaService],
  exports: [TenenciaService]
})
export class TenenciaModule {}