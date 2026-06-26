import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SincronizacionPreciosService } from './sincronizacion-precios.service';
import { Activo } from '../activo/entities/activo.entity'; 
import { ConfigModule } from '@nestjs/config';
import { PrecioConexion } from './conexion/precio-conexion.interface';
import { FinnhubService } from './conexion/finnhub.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activo]),ConfigModule],
  providers: [SincronizacionPreciosService,{provide: PrecioConexion,useClass: FinnhubService},],
})
export class FinnhubModule {}