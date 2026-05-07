import { Injectable } from '@nestjs/common';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activo } from './entities/activo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivoService {
  constructor(
      @InjectRepository(Activo)
      private readonly activoRepository: Repository<Activo>,
    ) {}

  create(createActivoDto: CreateActivoDto) {
    return 'This action adds a new activo';
  }

  findAll() {
    return `This action returns all activo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} activo`;
  }

  update(id: number, updateActivoDto: UpdateActivoDto) {
    return `This action updates a #${id} activo`;
  }

  remove(id: number) {
    return `This action removes a #${id} activo`;
  }

}
