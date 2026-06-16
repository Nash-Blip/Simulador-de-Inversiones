import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInversorDto } from './dto/input/create-inversor.dto';
import { IngresarFondosTarjetaDto } from './dto/input/ingresar-fondos-tarjeta.dto';
import { IngresarFondosTransferenciaDto } from './dto/input/ingresar-fondos-transferencia.dto';
import { RetirarFondosDto } from './dto/input/retirar-fondos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inversor, InversorRol } from './entities/inversor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InversorPerfilDto } from './dto/input/inversor.perfil.dto';
import { CambioPasswordDto } from './dto/input/cambio-password.dto';
import { TenenciaActivo } from '@/tenenciaActivo/tenenciaActivo.entity';

@Injectable()
export class InversorService {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>
  ) { }

  async create(dto: CreateInversorDto) {
    const existeInversor = await this.inversorRepo.findOneBy({ email: dto.email });
    if (existeInversor) {
      throw new ConflictException(`El email ${dto.email} ya está registrado.`);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const inversor = this.inversorRepo.create({
      email: dto.email,
      nombre: dto.nombre,
      password: hashedPassword,
      rol: InversorRol.USER,
      saldoVirtual: 10000,
      portafolio: {
        costoPortafolio: 0,
      }
    });
    return this.inversorRepo.save(inversor);
  }

  findAll() {
    return this.inversorRepo.find();
  }

  async findOne(id: number) {
    const inversor = await this.inversorRepo.findOneBy({ id });
    if (!inversor) {
      throw new NotFoundException(`Inversor con id ${id} no encontrado.`);
    }
    return inversor;
  }

  async findByEmail(email: string) {
    return this.inversorRepo.findOneBy({ email });
  }

  async findPortafolio(id: number) {
    const inversor = await this.inversorRepo.findOne({
      where: { id },
      relations: {
        portafolio: {
          tenencias: { activo: true },
          transacciones: true,
        }
      }
    });
    if (!inversor?.portafolio) {
      throw new NotFoundException(`Inversor con id ${id} no encontrado.`);
    }

    const tenenciasConRendimiento = inversor.portafolio.tenencias.map(t => ({
      ...t,
      rendimiento: this.calcularRendimientoTenencia(t),
    }));

    let valorPortafolio = this.calcularValorPortafolio(inversor.portafolio.tenencias);
    let costoPortafolio = Number(inversor.portafolio.costoPortafolio);
    let rendimientoPortafolio = this.calcularRendimientoPortafolio(valorPortafolio, costoPortafolio);

    const tieneActivos = inversor.portafolio.tenencias.some(t => t.cantidad > 0);
    if (!tieneActivos) {
      costoPortafolio = 0;
      valorPortafolio = 0
      rendimientoPortafolio = 0;
    }

    return {
      saldoVirtual: inversor.saldoVirtual,
      ...inversor.portafolio,
      valorPortafolio,
      rendimientoPortafolio,
      tenencias: tenenciasConRendimiento,
    };
  }

  private calcularRendimientoTenencia(tenencia: TenenciaActivo): number {
    const precioCompra = Number(tenencia.precioCompra);
    if (precioCompra === 0) return 0;
    return Number((((Number(tenencia.activo.precioActual) - precioCompra) / precioCompra) * 100).toFixed(2));
  }

  private calcularValorPortafolio(tenencias: TenenciaActivo[]): number {
    return Number(tenencias
      .reduce((total, t) => total + (Number(t.cantidad) * Number(t.activo.precioActual)), 0)
      .toFixed(2));
  }

  private calcularRendimientoPortafolio(valorPortafolio: number, costoPortafolio: number): number {
    if (costoPortafolio === 0) return 0;
    if (Math.abs(costoPortafolio) < 0.01) return 0;
    return Number((((valorPortafolio - costoPortafolio) / costoPortafolio) * 100).toFixed(2));
  }

  async ingresarFondosTarjeta(id: number, datosTarjeta: IngresarFondosTarjetaDto) {
    const inversor = await this.findOne(id)

    this.validarTarjeta(datosTarjeta);

    inversor.saldoVirtual += datosTarjeta.monto;
    await this.inversorRepo.save(inversor);

    return { mensaje: 'Fondos ingresados correctamente', saldoActual: inversor.saldoVirtual };
  }

  private validarTarjeta(datosTarjeta: IngresarFondosTarjetaDto) {
    const partes = datosTarjeta.vencimiento.split('/');
    const mes = partes[0];
    const anio = partes[1];
    const mesNumero = Number(mes);

    if (datosTarjeta.numeroTarjeta.length !== 16 ||
      datosTarjeta.cvv.length != 3 ||
      partes.length !== 2 ||
      mes.length !== 2 ||
      anio.length !== 2 ||
      mesNumero < 1 ||
      mesNumero > 12) {
      throw new BadRequestException('Tarjeta inválida');
    }
    const fechaActual = new Date();
    const anioActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1;

    const anioTarjetaCompleto = Number(String(anioActual).slice(0, 2) + anio);
    if (
      anioTarjetaCompleto < anioActual || 
      (anioTarjetaCompleto === anioActual && mesNumero < mesActual)
    ) {
      throw new BadRequestException('La tarjeta está vencida');
    }
  }

  async ingresarFondosTransferencia(id: number, dto: IngresarFondosTransferenciaDto) {
    const inversor = await this.findOne(id);

    inversor.saldoVirtual += dto.monto;
    await this.inversorRepo.save(inversor);

    return { mensaje: 'Fondos ingresados correctamente', saldoActual: inversor.saldoVirtual };
  }

  async retirarFondos(id: number, dto: RetirarFondosDto) {
    const inversor = await this.findOne(id);
    if (dto.monto > inversor.saldoVirtual) {
      throw new BadRequestException('Fondos insuficientes');
    }
    inversor.saldoVirtual -= dto.monto;
    await this.inversorRepo.save(inversor);
    return { mensaje: 'Fondos retirados correctamente', saldoActual: inversor.saldoVirtual };
  }

  async findPerfil(id: number): Promise<InversorPerfilDto> {
    const inversor = await this.findOne(id);

    return {
      nombre: inversor.nombre,
      email: inversor.email,
      saldo: inversor.saldoVirtual
    };
  }

  async cambiarPassword(id: number, dto: CambioPasswordDto): Promise<{ message: string }> {
    const inversor = await this.findOne(id);

    const coincidencia = await bcrypt.compare(dto.passwordActual, inversor.password);
    if (!coincidencia) {
      throw new ConflictException('La contraseña actual es incorrecta.');
    }

    inversor.password = await bcrypt.hash(dto.passwordNueva, 10);
    await this.inversorRepo.save(inversor);

    return { message: 'Contraseña actualizada con éxito.' };
  }
}