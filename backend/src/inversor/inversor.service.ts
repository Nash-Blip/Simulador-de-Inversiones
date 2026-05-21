import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inversor } from './entities/inversor.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
      rol: dto.rol ?? undefined,
      saldoVirtual: dto.saldoVirtual,
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
    return inversor.portafolio;
  }

  async getSaldoVirtual(id: number) {
    const inversor = this.findOne(id);
    return (await inversor).saldoVirtual;
  }
}
