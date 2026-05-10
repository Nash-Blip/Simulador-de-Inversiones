import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inversor } from '@/inversor/entities/inversor.entity'; 
import { Activo } from '@/activo/entities/activo.entity'; 
import { TipoTransaccion, Transaccion } from '@/transaccion/transaccion.entity'; 
import { CompraActivoDto } from '@/activo/dto/compra-activo.dto'; 
import { VentaActivoDto } from '@/activo/dto/venta-activo.dto';
import { TenenciaActivo } from '@/tenenciaActivo/tenenciaActivo.entity';


@Injectable()
export class Sistema {
  constructor(private dataSource: DataSource) {}

  async procesarCompra(dto: CompraActivoDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const inversor = await queryRunner.manager.findOne(Inversor, {where: { id: dto.inversorId }});
      if (!inversor) throw new NotFoundException('El inversor no existe');

      if (!inversor.portafolio.tenencias) {
        inversor.portafolio.tenencias = [];
      }

      const activo = await queryRunner.manager.findOne(Activo, { where: { id: dto.activoId } });
      if (!activo) throw new NotFoundException('El activo no existe');

      const costoTotal = activo.precioActual * dto.cantidad;
      if (inversor.saldoVirtual < costoTotal) {
        throw new BadRequestException('Saldo insuficiente');
      }

      let tenencia = inversor.portafolio.tenencias.find(t => t.activo.id === dto.activoId);
      if (!tenencia) {
        tenencia = queryRunner.manager.create(TenenciaActivo, {
        cantidad: dto.cantidad,
        portafolio: inversor.portafolio,
        activo: activo,
        });
      }
      else {
        tenencia.cantidad += dto.cantidad;
      }

      if (!tenencia.id) { 
        inversor.portafolio.tenencias.push(tenencia);
      }

      inversor.saldoVirtual -= costoTotal;
      inversor.portafolio.valorPortafolio += costoTotal;

      const nuevaTransaccion = queryRunner.manager.create(Transaccion, {
        tipoTransaccion: TipoTransaccion.COMPRA,
        cantidad: dto.cantidad,
        precioEjecutado: activo.precioActual,
        portafolio: inversor.portafolio,
        activo: activo,
      });

      await queryRunner.manager.save(inversor);
      await queryRunner.manager.save(nuevaTransaccion);

      await queryRunner.commitTransaction();

      return { status: 'success', data: nuevaTransaccion };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async procesarVenta(dto: VentaActivoDto){
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const inversor = await queryRunner.manager.findOne(Inversor, {
        where: { id: dto.inversorId },
        relations: ['portafolio', 'portafolio.tenencias', 'portafolio.tenencias.activo'],
      });
      if (!inversor) throw new NotFoundException('El inversor no existe');

      const activo = await queryRunner.manager.findOne(Activo, { where: { id: dto.activoId } });
      if (!activo) throw new NotFoundException('El activo no existe');

      const tenencia = inversor.portafolio.tenencias.find(t => t.activo.id === dto.activoId);
      if (!tenencia || tenencia.cantidad < dto.cantidad) {
        throw new BadRequestException('No tienes suficientes activos para vender');
      }

      tenencia.cantidad -= dto.cantidad;

      if (tenencia.cantidad === 0) {
        await queryRunner.manager.remove(tenencia);
      } else {
        await queryRunner.manager.save(tenencia);
      }

      const gananciaTotal = activo.precioActual * dto.cantidad;
      inversor.saldoVirtual += gananciaTotal;
      inversor.portafolio.valorPortafolio -= gananciaTotal;

      const nuevaTransaccion = queryRunner.manager.create(Transaccion, {
        tipoTransaccion: TipoTransaccion.VENTA,
        cantidad: dto.cantidad,
        precioEjecutado: activo.precioActual,
        portafolio: inversor.portafolio,
        activo: activo,
      });

      await queryRunner.manager.save(inversor);
      await queryRunner.manager.save(nuevaTransaccion);
      await queryRunner.commitTransaction();

      return { status: 'success', data: nuevaTransaccion };

    }catch(error){
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}