import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Portafolio } from "./entities/portafolio.entity";

@Injectable()
export class PortafolioService {
    constructor(
        @InjectRepository(Portafolio)
        private readonly portafolioRepository: Repository<Portafolio>,
    ) {}

    async create(): Promise<Portafolio> {
        const portafolio = this.portafolioRepository.create({
            valorPortafolio: 0,
        });
        return await this.portafolioRepository.save(portafolio);
    }

    async findOne(id: number): Promise<Portafolio> {
        const portafolio = await this.portafolioRepository.findOne({
            where: { id },
            relations: ["transacciones", "tenenciaActivo"]
        });
        if (!portafolio) throw new NotFoundException(`Portafolio con id ${id} no encontrado`);
        return portafolio;
    }

    async getHistorial(id: number): Promise<Portafolio> {
        const portafolio = await this.portafolioRepository.findOne({
            where: { id },
            relations: ["transacciones"]
        });
        if (!portafolio) throw new NotFoundException(`Portafolio con id ${id} no encontrado`);
        return portafolio;
    }

    async getGananciaPerdida(id: number): Promise<number> {
        await this.findOne(id); 
        return 0; // LÓGICA PENDIENTE
    }
}