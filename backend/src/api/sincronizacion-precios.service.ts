import { Injectable, OnApplicationBootstrap, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activo } from '@/activo/entities/activo.entity'; 
import { PrecioConexion } from './conexion/precio-conexion.interface';

@Injectable()
export class SincronizacionPreciosService implements OnApplicationBootstrap {
    private readonly logger = new Logger(SincronizacionPreciosService.name);

  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    private readonly precioConexion: PrecioConexion
  ) {}

  async onApplicationBootstrap() {
    const activos = await this.activoRepo.find();
    
    for (const activo of activos) {
      try {
        const precioInicial = await this.precioConexion.obtenerPrecio(activo.ticker);
        await this.updateActivo(activo.ticker, precioInicial);
      } catch (error) {        
        this.logger.error(`Error con ${activo.ticker}. No se pudo obtener el valor inicial.`);
      }
    }
    this.logger.log('Sincronización finalizada.');
  }

  private async updateActivo(ticker: string, precioInicial: number) {
    let activo = await this.activoRepo.findOne({ where: { ticker } });

    if (!activo) {
      throw new NotFoundException(`Activo con ticker ${ticker} no encontrado.`);
    } 
      
    activo.precioInicial = precioInicial;
    activo.precioActual = precioInicial;
    activo.valorMaximo = precioInicial;
    activo.valorMinimo = precioInicial;

    await this.activoRepo.save(activo);
    this.logger.log(`[UPDATE] ${ticker} actualizado a $${precioInicial}`);          
  }
}