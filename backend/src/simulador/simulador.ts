import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { Activo } from '../activo/entities/activo.entity'; 
import { ActivoService } from '../activo/activo.service';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { TransaccionService } from '@/transaccion/transaccion.service';

@Injectable()
export class SimuladorService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SimuladorService.name);
  
  // Guardaremos el historial de precios en memoria para ver cómo viene fluctuando
  private historialPrecios: Map<number, number[]> = new Map();

  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    private readonly transaccionService: TransaccionService,
    private readonly activoService: ActivoService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Comprobando catálogo de activos...');
    await this.cargarActivosIniciales();
    this.logger.log('Bot Simulador de Mercado inicializado y corriendo.');
  }

  private async cargarActivosIniciales() {
    const cantidad = await this.activoRepo.count();
    
    if (cantidad === 0) {
      await this.activoService.create({nombre:'Apple Inc.', ticker: 'AAPL', precioInicial: 0});
      await this.activoService.create({nombre: 'Microsoft Corporation', ticker: 'MSFT', precioInicial: 0});
      await this.activoService.create({nombre: 'NVIDIA Corporation', ticker: 'NVDA', precioInicial: 0});
      await this.activoService.create({nombre: 'Amazon.com Inc.', ticker: 'AMZN', precioInicial: 0});
      await this.activoService.create({nombre: 'Tesla Inc.', ticker: 'TSLA', precioInicial: 0});

    this.logger.log('¡Activos iniciales cargados con éxito!');
    }
  }

  @Interval(5000)
  async simularMercado() {
    try {
      // 1. Obtener un activo al azar
      const activoAzar = await this.obtenerActivoAlAzar();
      if (!activoAzar) return;

      // 2. Registrar precio y analizar la tendencia del mercado
      const tendencia = this.actualizarHistorialYCalcularTendencia(activoAzar.id, activoAzar.precioActual);

      // 3. Tomar decisiones de trading (Acción y Volumen)
      const decision = this.decidirAcción(tendencia);
      const cantidad = this.calcularCantidad(activoAzar.precioActual);

      // 4. Ejecutar la operación en la Base de Datos
      await this.transaccionService.create(decision, cantidad, activoAzar.precioActual * cantidad, null, activoAzar);
      const nuevoPrecio = await this.activoService.actualizarActivo(activoAzar, cantidad, decision);

      this.logger.log(
        `[SIMULACIÓN] Activo: ${activoAzar.nombre} | Acción: ${decision} | Cantidad: ${cantidad} | Precio de ejecución: $${activoAzar.precioActual.toFixed(2)} | Nuevo Precio: $${nuevoPrecio.toFixed(2)}`
      );

    } catch (error) {
      this.logger.error('Error en el ciclo del simulador:', error);
    }
  }

  private async obtenerActivoAlAzar(): Promise<Activo | null> {
    const activos = await this.activoRepo.find();
    if (activos.length === 0) return null;
    return activos[Math.floor(Math.random() * activos.length)];
  }

  private actualizarHistorialYCalcularTendencia(activoId: number, precioActual: number): number {
    if (!this.historialPrecios.has(activoId)) {
      this.historialPrecios.set(activoId, []);
    }
    
    const precios = this.historialPrecios.get(activoId)!;
    precios.push(precioActual);
    if (precios.length > 5) {
      precios.shift(); // Mantenemos solo las últimas 5 variaciones
    }

    // Calcula la tendencia: positivo si sube, negativo si baja
    return precios.length > 1 ? precioActual - precios[0] : 0;
  }

  private decidirAcción(tendencia: number): TipoTransaccion {
    // Psicología de mercado básica (FOMO vs Pánico) con factor aleatorio para romper monotonía
    if (tendencia > 0) {
      return Math.random() > 0.3 ? TipoTransaccion.COMPRA : TipoTransaccion.VENTA;
    } else {
      return Math.random() > 0.4 ? TipoTransaccion.VENTA : TipoTransaccion.COMPRA;
    }
  }
  // esta funcion limita al simulador ya que sino compraria acciones de a cientas por operacion. 
  private calcularCantidad(precioActual: number): number {
    if (precioActual > 500) {
      // Para acciones caras (NVIDIA), opera entre 1 y 5 acciones
      return Math.floor(Math.random() * 5) + 1; 
    } else if (precioActual > 200) {
      // Para acciones medianas (Microsoft), opera entre 2 y 15 acciones
      return Math.floor(Math.random() * 14) + 2; 
    } else {
      // Para acciones más baratas (Apple, Amazon, Tesla), opera entre 5 y 30 acciones
      return Math.floor(Math.random() * 26) + 5; 
    }
  }
}