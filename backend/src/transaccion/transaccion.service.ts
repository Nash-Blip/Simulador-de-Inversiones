import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaccion } from "./entities/transaccion.entity";
import { CreateTransaccionDto } from "./dto/create-transaccion.dto";

@Injectable()
export class TransaccionService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transaccionRepository: Repository<Transaccion>,
  ) { }

  async create(createTransaccionDto: CreateTransaccionDto): Promise<Transaccion> {
    const transaccion = this.transaccionRepository.create({
      ...createTransaccionDto,
      portafolio: { id: createTransaccionDto.portafolioId },
    });
    return await this.transaccionRepository.save(transaccion);
  }

  async findAll(): Promise<Transaccion[]> {
    return await this.transaccionRepository.find({
      relations: ["portafolio"]
    });
  }

  async findOne(id: number): Promise<Transaccion> {
    const transaccion = await this.transaccionRepository.findOne({
      where: { id },
      relations: ["portafolio"]
    });
    if (!transaccion) throw new NotFoundException(`Transaccion con id ${id} no encontrada`);
    return transaccion;
  }
}