import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivoDto } from './dto/input/create-activo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { Repository } from 'typeorm';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { UpdateActivoDto } from './dto/input/update-activo.dto';

@Injectable()
export class ActivoService {
  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>
  ) {}

  async create(dto: CreateActivoDto) {
    const existeActivo = await this.activoRepo.findOneBy({nombre: dto.nombre});
    if(existeActivo){
      throw new ConflictException(`El Activo ${dto.nombre} ya existe.`);
    }
    const activo = this.activoRepo.create({
      nombre: dto.nombre,
      ticker: dto.ticker,
      precioInicial: dto.precioInicial,
      precioActual: dto.precioInicial,
      valorMaximo: 0,
      valorMinimo: 0,
      cantOperaciones: 0,
      totalEjecutado: 0
    });
    return this.activoRepo.save(activo);
  }

  async update(id: number, dto: UpdateActivoDto) {
    const existeActivo = await this.activoRepo.findOneBy({ id });
    if (!existeActivo) {
      throw new NotFoundException(`No se encontró el Activo con ID ${id}`);
    }
    const { nombre, ticker } = dto;
    
    return await this.activoRepo.save({
      id,
      nombre,
      ticker,
    });
  }

  findAll() {
    return this.activoRepo.find();
  }

  async findOne(id: number) {
    const activo = await this.activoRepo.findOne({
      where: { id },
      relations: ['transacciones']
    });
    if(!activo){
      throw new NotFoundException(`Activo con id ${id} no encontrado.`);
    }
    return activo;
  }

  async actualizarActivo(activo: Activo, cantidad: number, tipo: TipoTransaccion) {
    const nuevoPrecio = await this.actualizarPrecioActivo(activo,cantidad,tipo);

    let nuevoMax = activo.valorMaximo
    let nuevoMin = activo.valorMinimo

    if(nuevoPrecio > activo.valorMaximo){
      nuevoMax = nuevoPrecio;
    }
    if(nuevoPrecio < activo.valorMinimo){
      nuevoMin = nuevoPrecio;
    }
    
    await this.activoRepo.update(activo.id, { 
      precioActual: nuevoPrecio,
      valorMaximo: nuevoMax,
      valorMinimo: nuevoMin,
      cantOperaciones: activo.cantOperaciones + 1,
      totalEjecutado: activo.totalEjecutado + activo.precioActual
    });
    return nuevoPrecio;
  }

  private async actualizarPrecioActivo(activo: Activo, cantidad: number, tipo: TipoTransaccion) {
    // Sensibilidad: Qué tanto afecta cada unidad operada al precio.
    // Ej: 0.0001 significa que 100 unidades operadas mueven el precio un 1%.
    const factorSensibilidad = 0.0001; 
    const impacto = activo.precioActual * (cantidad * factorSensibilidad);
    const precioBase = activo.precioActual;
    let nuevoPrecio = 0;

    if (tipo === TipoTransaccion.COMPRA) {
      // La compra aumenta la demanda -> Sube el precio
      nuevoPrecio = precioBase + impacto;
    } else {
      // La venta aumenta la oferta -> Baja el precio (mínimo 0.01)
      nuevoPrecio = Math.max(0.01, precioBase - impacto);
    }
    return nuevoPrecio;
  }
}
