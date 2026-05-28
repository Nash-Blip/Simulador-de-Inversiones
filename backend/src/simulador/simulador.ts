import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interval } from '@nestjs/schedule';
import { Activo } from '../activo/entities/activo.entity'; 
import { Transaccion } from '@/transaccion/transaccion.entity'; 
import { ActivoService } from '../activo/activo.service';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { TransaccionService } from '@/transaccion/transaccion.service';

@Injectable()
export class SimuladorService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SimuladorService.name);
  
  // Guardaremos el histórico de precios en memoria para saber "cómo viene fluctuando"
  private historicoPrecios: Map<number, number[]> = new Map();

  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    private readonly transaccionService: TransaccionService,
    private readonly activoService: ActivoService,
  ) {}

  // Este método de NestJS hace que el simulador arranque apenas levanta el servidor
  async onApplicationBootstrap() {
    this.logger.log('Comprobando catálogo de activos...');
    await this.cargarActivosIniciales();
    this.logger.log('Bot Simulador de Mercado inicializado y corriendo.');
  }

  private async cargarActivosIniciales() {
    const cantidad = await this.activoRepo.count();
    
    if (cantidad === 0) {
    const activosSemilla = [
        { nombre: 'Apple Inc.', ticker: 'AAPL', precioInicial: 0, precioActual: 0 },
        { nombre: 'Microsoft Corporation', ticker: 'MSFT', precioInicial: 0, precioActual: 0 },
        { nombre: 'NVIDIA Corporation', ticker: 'NVDA', precioInicial: 0, precioActual: 0 },
        { nombre: 'Amazon.com Inc.', ticker: 'AMZN', precioInicial: 0, precioActual: 0 },
        { nombre: 'Tesla Inc.', ticker: 'TSLA', precioInicial: 0, precioActual: 0 },
    ];

      const entidades = this.activoRepo.create(activosSemilla);
      await this.activoRepo.save(entidades);
      this.logger.log('¡Activos iniciales cargados con éxito!');
    }
  }

  // Ejecuta la simulación automáticamente cada 5 segundos
  @Interval(5000)
  async simularMercado() {
    try {
      // 1. Obtener todos los activos disponibles
      const activos = await this.activoRepo.find();
      if (activos.length === 0) return;

      // 2. Elegir un activo al azar
      const activoAzar = activos[Math.floor(Math.random() * activos.length)];
      const precioActual = Number(activoAzar.precioActual);

      // 3. Registrar el precio en el historial para medir la fluctuación
      if (!this.historicoPrecios.has(activoAzar.id)) {
        this.historicoPrecios.set(activoAzar.id, []);
      }
      const precios = this.historicoPrecios.get(activoAzar.id)!;
      precios.push(precioActual);
      if (precios.length > 5) precios.shift(); // Mantenemos solo las últimas 5 variaciones

      // 4. Analizar cómo viene fluctuando (Tendencia)
      let tendencia = 0; // Positivo si sube, negativo si baja
      if (precios.length > 1) {
        tendencia = precioActual - precios[0]; 
      }

      // 5. Decidir si COMPRAR o VENDER basándose en la tendencia
      // Psicología de mercado básica: si el precio viene subiendo (tendencia > 0), el bot tiende a comprar por FOMO. 
      // Si viene bajando, tiende a vender por pánico. Añadimos un factor aleatorio (Math.random()) para romper la monotonía.
      let decision: TipoTransaccion;
      if (tendencia > 0) {
        decision = Math.random() > 0.3 ? TipoTransaccion.COMPRA : TipoTransaccion.VENTA;
      } else {
        decision = Math.random() > 0.4 ? TipoTransaccion.VENTA : TipoTransaccion.COMPRA;
      }

      // 6. Decidir la cantidad
      let cantidad = 1;

      if (precioActual > 500) {
      // Para acciones caras (NVIDIA), opera entre 1 y 5 acciones por vuelta
      cantidad = Math.floor(Math.random() * 5) + 1; 
      } else if (precioActual > 200) {
      // Para acciones medianas (Microsoft), opera entre 2 y 15 acciones
      cantidad = Math.floor(Math.random() * 14) + 2; 
      } else {
      // Para acciones más baratas (Apple, Amazon, Tesla), opera entre 5 y 30 acciones
      cantidad = Math.floor(Math.random() * 26) + 5; 
      }

      if (cantidad <= 0) return;

      // 7. Crear la transacción sin portafolio
      await this.transaccionService.create(decision,cantidad,precioActual*cantidad,null,activoAzar);

      // 8. Actualizar el precio usando el servicio que creamos antes
      const nuevoPrecio = await this.activoService.actualizarPrecioActivo(activoAzar, cantidad, decision);

      this.logger.log(
        `[SIMULACIÓN] Activo: ${activoAzar.nombre} | Acción: ${decision} | Cantidad: ${cantidad} | Precio de ejecución: $${precioActual.toFixed(2)} | Nuevo Precio: $${nuevoPrecio.toFixed(2)}`
      );

    } catch (error) {
      this.logger.error('Error en el ciclo del simulador:', error);
    }
  }
}