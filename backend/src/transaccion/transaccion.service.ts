import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TipoTransaccion, Transaccion } from "./transaccion.entity";
import { Repository } from "typeorm";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Activo } from "@/activo/entities/activo.entity";

@Injectable()
export class TransaccionService {
    constructor(
        @InjectRepository(Transaccion)
        private readonly transaccionRepo: Repository<Transaccion>
    ) {}

    async findAll() {
        const transacciones = await this.transaccionRepo.find({
            relations: {
                activo: true,
            }
        });
        return transacciones.map((t) => ({
            id: t.id,
            tipoTransaccion: t.tipoTransaccion,
            cantidad: t.cantidad,
            precioEjecutado: t.precioEjecutado,
            fecha: t.fecha,
            ticker: t.activo ? t.activo.ticker : null,
        }));
    }

    async create(tipoTransaccion: TipoTransaccion, cantidad: number, precioEjecutado: number, portafolio: Portafolio | null, activo: Activo){
        const transaccion = this.transaccionRepo.create({
            tipoTransaccion: tipoTransaccion,
            cantidad: cantidad,
            precioEjecutado: precioEjecutado,
            portafolio: portafolio,
            activo: activo,
        });
        return await this.transaccionRepo.save(transaccion);
    }
    
}