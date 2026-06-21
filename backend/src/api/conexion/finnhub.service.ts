import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrecioConexion } from './precio-conexion.interface';

const finnhub = require('finnhub');

@Injectable()
export class FinnhubService implements PrecioConexion {
  private readonly logger = new Logger(FinnhubService.name);
  private readonly finnhubClient;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('FINNHUB_API_KEY');
    this.finnhubClient = new finnhub.DefaultApi(apiKey);
  }

  async obtenerPrecio(ticker: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.finnhubClient.quote(ticker, (error: any, data: any) => {
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
}