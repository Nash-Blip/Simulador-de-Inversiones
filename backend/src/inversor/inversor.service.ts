import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inversor } from './entities/inversor.entity';
import { Repository } from 'typeorm';
import { Portafolio } from '@/portafolio/portafolio.entity';

@Injectable()
export class InversorService {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>,
    @InjectRepository(Portafolio)
    private readonly portafolioRepo: Repository<Portafolio>,
    ) {}

  async create(dto: CreateInversorDto) {
    const existeInversor = await this.inversorRepo.findOneBy({nombre: dto.nombre});
    if(existeInversor){
      throw new ConflictException(`El Inversor ${dto.nombre} ya existe.`);
    }
    const inversor = this.inversorRepo.create({
      nombre: dto.nombre,
      saldoVirtual: dto.saldoVirtual,
      portafolio: {
        valorPortafolio: 0,
        transacciones: [],
        tenencias: [],
      }
    });
    return this.inversorRepo.save(inversor);
  }

  findAll() {
    return this.inversorRepo.find();
  }

  async findOne(id: number) {
    const inversor = await this.inversorRepo.findOneBy({ id });
    if(!inversor){
      throw new NotFoundException(`Inversor con id ${id} no encontrado.`);
    }
    return inversor;
  }

  async findPortafolio(idInversor: number) {
    await this.findOne(idInversor);
    const portafolio = await this.portafolioRepo.findOne({      
      where: { inversor: { id: idInversor }},
      relations: ['tenencias', 'transacciones', 'tenencias.activo']});
    return portafolio;
  }

  async getSaldoVirtual(id: number) {
    const inversor = this.findOne(id);
    return (await inversor).saldoVirtual;
  }
}
