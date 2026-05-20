import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivoDto } from './dto/create-activo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { Repository } from 'typeorm';

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
    const activo = this.activoRepo.create(dto);
    return this.activoRepo.save(activo);
  }

  findAll() {
    return this.activoRepo.find({
      relations: ['transacciones']
    });
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
}
