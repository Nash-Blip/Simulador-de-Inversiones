import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TipoTransaccion, Transaccion } from "./transaccion.entity";
import { Repository } from "typeorm";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { Activo } from "@/activo/entities/activo.entity";
import { GetTransaccionesQueryDto } from "./dto/input/get-transaccion-query.dto";

@Injectable()
export class TransaccionService {
    constructor(
        @InjectRepository(Transaccion)
        private readonly transaccionRepo: Repository<Transaccion>
    ) {}

    async findAll(query: GetTransaccionesQueryDto) {
        const page = query.page ? Number(query.page) : 1;
        const LIMIT_FIJO = 10;
        const skip = (page - 1) * LIMIT_FIJO;

        const queryBuilder = this.transaccionRepo.createQueryBuilder('transaccion')
            .leftJoinAndSelect('transaccion.activo', 'activo');

        this.aplicarFiltros(queryBuilder, query);

        queryBuilder
            .orderBy('transaccion.fecha', 'DESC')
            .skip(skip)
            .take(LIMIT_FIJO);

        const [transacciones, totalItems] = await queryBuilder.getManyAndCount();
        return this.formatearRespuestaPaginada(transacciones, totalItems, page, LIMIT_FIJO);
    }

    async findHistorialTransacciones(inversorId: number, query: GetTransaccionesQueryDto) {
        const page = query.page ? Number(query.page) : 1;
        const LIMIT_FIJO = 10;
        const skip = (page - 1) * LIMIT_FIJO;

        const queryBuilder = this.transaccionRepo.createQueryBuilder('transaccion')
            .leftJoinAndSelect('transaccion.activo', 'activo')
            .leftJoin('transaccion.portafolio', 'portafolio')
            .leftJoin('portafolio.inversor', 'inversor')
            .where('inversor.id = :inversorId', { inversorId });

        this.aplicarFiltros(queryBuilder, query);

        queryBuilder
            .orderBy('transaccion.fecha', 'DESC')
            .skip(skip)
            .take(LIMIT_FIJO);

        const [transacciones, totalItems] = await queryBuilder.getManyAndCount();
        return this.formatearRespuestaPaginada(transacciones, totalItems, page, LIMIT_FIJO);
    }

    async create(tipoTransaccion: TipoTransaccion, cantidad: number, precioEjecutado: number, portafolio: Portafolio | null, activo: Activo) {
        const transaccion = this.transaccionRepo.create({
            tipoTransaccion: tipoTransaccion,
            cantidad: cantidad,
            precioEjecutado: precioEjecutado,
            portafolio: portafolio,
            activo: activo,
        });
        return await this.transaccionRepo.save(transaccion);
    }

    private aplicarFiltros(queryBuilder: any, query: GetTransaccionesQueryDto) {
        if (query.tipoTransaccion) {
            // Limpio, nativo y directo. Ambos son strings ahora.
            queryBuilder.andWhere('transaccion.tipoTransaccion = :tipo', { tipo: query.tipoTransaccion });
        }

        if (query.fechaInicio && query.fechaFin) {
            const inicio = new Date(`${query.fechaInicio}T00:00:00.000Z`);
            const fin = new Date(`${query.fechaFin}T23:59:59.999Z`);
            queryBuilder.andWhere('transaccion.fecha BETWEEN :inicio AND :fin', { inicio, fin });
        }

        if (query.search) {
            queryBuilder.andWhere(
                '(activo.ticker ILIKE :search OR activo.nombre ILIKE :search)',
                { search: `%${query.search}%` }
            );
        }
    }

    private formatearRespuestaPaginada(transacciones: Transaccion[], totalItems: number, page: number, limit: number) {
        const dataFormateada = transacciones.map((t) => ({
            id: t.id,
            tipoTransaccion: t.tipoTransaccion,
            cantidad: t.cantidad,
            precioEjecutado: t.precioEjecutado,
            fecha: t.fecha,
            ticker: t.activo ? t.activo.ticker : null,
        }));

        return {
            data: dataFormateada,
            meta: {
                totalItems,
                itemCount: dataFormateada.length,
                itemsPerPage: limit,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
            }
        };
    }
}