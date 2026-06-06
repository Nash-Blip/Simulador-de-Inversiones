import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { IngresarFondosTarjetaDto } from './dto/ingresar-fondos-tarjeta.dto';
import { IngresarFondosTransferenciaDto } from './dto/ingresar-fondos-transferencia.dto';
import { RetirarFondosDto } from './dto/retirar-fondos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inversor, InversorRol } from './entities/inversor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InversorPerfilDto } from './dto/inversor.perfil.dto';
import { CambioPasswordDto } from './dto/cambio-password.dto';

@Injectable()
export class InversorService {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>
  ) {}

  async onApplicationBootstrap() {
    await this.crearAdmin();
  }

  private async crearAdmin() {
    const adminEnSistema = await this.inversorRepo.count()

    if (adminEnSistema === 0) {
      const passwordHasheada = await bcrypt.hash('pruebas000', 10);
      const admin = this.inversorRepo.create({
        email: "pruebasAdmin@mail.com",
        nombre: "admin",
        password: passwordHasheada,
        rol: InversorRol.ADMIN,
        saldoVirtual: 0,
        portafolio: {
          valorPortafolio: 0,
        }
      });
      return this.inversorRepo.save(admin);
    }
  }

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
        valorPortafolio: 0,
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
    return {
      saldoVirtual: inversor.saldoVirtual,
      ...inversor.portafolio,
    };
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