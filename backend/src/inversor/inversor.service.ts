import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inversor } from './entities/inversor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InversorService {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>
    ) {}

  async create(dto: CreateInversorDto) {
    const existeInversor = await this.inversorRepo.findOneBy({nombre: dto.nombre});
    if(existeInversor){
      throw new ConflictException(`El Inversor ${dto.nombre} ya existe.`);
    }
    const activo = this.inversorRepo.create(dto);
    return this.inversorRepo.save(activo);
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
}
