import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivoDto } from './dto/input/create-activo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { Not, Repository } from 'typeorm';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { UpdateActivoDto } from './dto/input/update-activo.dto';
import { formatearRespuestaPaginada } from '@/common/utils/pagination.util';
import { GetActivosQueryDto } from './dto/input/get-activo-query.dto';

@Injectable()
export class ActivoService {
  constructor(
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>
  ) { }

  async create(dto: CreateActivoDto) {
    await this.validarActivoDuplicadoCreate(dto.nombre,dto.ticker);

    const activo = this.activoRepo.create({
      nombre: dto.nombre,
      ticker: dto.ticker,
      precioInicial: dto.precioInicial,
      precioActual: dto.precioInicial,
      valorMaximo: dto.precioInicial,
      valorMinimo: dto.precioInicial,
      cantOperaciones: 0,
      totalEjecutado: 0
    });
    return await this.activoRepo.save(activo);
  }

  async update(id: number, dto: UpdateActivoDto) {
    const existeActivo = await this.activoRepo.findOneBy({ id });
    if (!existeActivo) {
      throw new NotFoundException(`No se encontró el Activo con ID ${id}`);
    }

    await this.validarActivoDuplicadoUpdate(dto.nombre,dto.ticker,id);

    const { nombre, ticker } = dto;
    return await this.activoRepo.save({
      id,
      nombre,
      ticker,
    });
  }

  async findAll() {
    return this.activoRepo.find();
  }

  async findAllPaginado(query: GetActivosQueryDto) {
    const page = query.page ?? 1;
    const LIMIT_FIJO = 8;
    const skip = (page - 1) * LIMIT_FIJO;

    const queryBuilder = this.activoRepo.createQueryBuilder('activo');

    if (query.search) {
      queryBuilder.andWhere(
        '(activo.nombre ILIKE :search OR activo.ticker ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    queryBuilder.orderBy('activo.nombre', 'ASC').skip(skip).take(LIMIT_FIJO);

    const [activos, totalItems] = await queryBuilder.getManyAndCount();
    return formatearRespuestaPaginada(activos, totalItems, page, LIMIT_FIJO);
  }

  async findOne(id: number) {
    const activo = await this.activoRepo.findOne({
      where: { id },
      relations: ['transacciones']
    });
    if (!activo) {
      throw new NotFoundException(`Activo con id ${id} no encontrado.`);
    }
    return activo;
  }

  async actualizarActivo(activo: Activo, cantidad: number, tipo: TipoTransaccion) {
    const nuevoPrecio = await this.actualizarPrecioActivo(activo, cantidad, tipo);

    let nuevoMax = activo.valorMaximo
    let nuevoMin = activo.valorMinimo

    if (nuevoPrecio > activo.valorMaximo) {
      nuevoMax = nuevoPrecio;
    }
    if (nuevoPrecio < activo.valorMinimo) {
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

  private async validarActivoDuplicadoUpdate(nombre: string, ticker: string, id: number){
    const existeNombre = await this.activoRepo.findOneBy({ nombre: nombre, id: Not(id) });
    if (existeNombre) {
      throw new ConflictException(`El Activo ${nombre} ya existe.`);
    }
    const existeTicker = await this.activoRepo.findOneBy({ ticker: ticker, id: Not(id) });
    if (existeTicker) {
      throw new ConflictException(`El activo con el ticker ${ticker} ya existe.`);
    }
  }

  private async validarActivoDuplicadoCreate(nombre: string, ticker: string){ 
    const existeNombre = await this.activoRepo.findOneBy({ nombre: nombre });
    if (existeNombre) {
      throw new ConflictException(`El Activo ${nombre} ya existe.`);
    }
    const existeTicker = await this.activoRepo.findOneBy({ ticker: ticker });
    if (existeTicker) {
      throw new ConflictException(`El activo con el ticker ${ticker} ya existe.`);
    }
  }
}
