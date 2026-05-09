import { Injectable, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inversor } from '@/inversor/entities/inversor.entity'; 
import { Activo } from '@/activo/entities/activo.entity'; 
import { Transaccion } from '@/transaccion/transaccion.entity'; 
import { CompraActivoDto } from '@/activo/dto/compra-activo.dto'; 

@Injectable()
export class Sistema {
  constructor(private dataSource: DataSource) {}

  async procesarCompra(dto: CompraActivoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { inversorId, activoId, cantidad } = dto;

      // 1. Buscar entidades dentro de la transacción
      const inversor = await queryRunner.manager.findOne(Inversor, {
        where: { id: inversorId },
        relations: ['portfolio'],
      });
      const activo = await queryRunner.manager.findOne(Activo, { where: { id: activoId } });

      if (!inversor || !activo) throw new Error('Inversor o Activo no encontrado');

      // 2. Validar Saldo
      const total = activo.precioActual * cantidad;
      if (inversor.portafolio.valorPortafolio < total) {
        throw new Error('Saldo insuficiente para completar la operación');
      }

      // 3. Ejecutar Lógica de Negocio
      inversor.portafolio.valorPortafolio -= total;

      const transaccion = queryRunner.manager.create(Transaccion, {
        cantidad,
        precioEjecutado: activo.precioActual,
        portafolio: inversor.portafolio,
        activo: activo,
      });

      // 4. Persistir cambios
      await queryRunner.manager.save(inversor.portafolio);
      await queryRunner.manager.save(transaccion);

      await queryRunner.commitTransaction();
      return transaccion;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
}