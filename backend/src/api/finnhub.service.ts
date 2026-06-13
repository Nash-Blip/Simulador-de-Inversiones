import { Injectable, OnApplicationBootstrap, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activo } from '@/activo/entities/activo.entity'; 

require('dotenv').config();

const finnhub = require('finnhub');
const finnhubClient = new finnhub.DefaultApi(process.env.FINNHUB_API_KEY)

@Injectable()
export class FinnhubService implements OnApplicationBootstrap {
    private readonly logger = new Logger(FinnhubService.name);

  // Los tickers que tu simulador necesita al arrancar

  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
  ) {}

  async onApplicationBootstrap() {
    let tickers : string[] = []; 
    let activos = await this.activoRepo.find();
    activos.forEach((activo) => { 
      tickers.push(activo.ticker);
    })
    for (const ticker of tickers) {
      try {
        const precioInicial = await this.obtenerPrecioInicial(ticker);
        await this.updateActivo(ticker, precioInicial);
      } catch (error) {        
        this.logger.error(`Error con ${ticker}. No se pudo obtener el valor inicial.`);
      }
    }
    this.logger.log('Sincronización finalizada.');
  }

  private async obtenerPrecioInicial(ticker: string): Promise<number> {
    return new Promise((resolve, reject) => {
      finnhubClient.quote(ticker, (error: any, data: any, response: any) => {
          if (error) {
            this.logger.error(`[Finnhub API Error] Falló ${ticker}. Detalle:`, error);
            return reject(new Error(`Error en llamada a Finnhub SDK: ${error.message || error}`));
        }
        
          if (data && data.c !== undefined && data.c !== 0) {
          resolve(data.c);
        } else {
          reject(new Error(`La API no retornó un precio válido ('c') para el ticker: ${ticker}`));
        }
      });
    });
  }

  private async updateActivo(ticker: string, precioInicial: number) {
    let activo = await this.activoRepo.findOne({ where: { ticker } });

      if (!activo)
      {
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