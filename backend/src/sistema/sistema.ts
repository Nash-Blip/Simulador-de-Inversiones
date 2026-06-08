import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inversor } from '@/inversor/entities/inversor.entity';
import { Activo } from '@/activo/entities/activo.entity';
import { TipoTransaccion, Transaccion } from '@/transaccion/transaccion.entity';
import { CompraActivoDto } from '@/activo/dto/compra-activo.dto';
import { VentaActivoDto } from '@/activo/dto/venta-activo.dto';
import { TenenciaActivo } from '@/tenenciaActivo/tenenciaActivo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InversorService } from '@/inversor/inversor.service';
import { ActivoService } from '@/activo/activo.service';
import { Portafolio } from '@/portafolio/portafolio.entity';
import { TransaccionService } from '@/transaccion/transaccion.service';


@Injectable()
export class Sistema {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>,
    @InjectRepository(TenenciaActivo)
    private readonly tenenciaRepo: Repository<TenenciaActivo>,
    private readonly transaccionService: TransaccionService,
    private readonly inversorService: InversorService,
    private readonly activoService: ActivoService,
  ) { }

  async procesarCompra(dto: CompraActivoDto, inversorId: number) {
    try {
      const inversor = await this.inversorService.findOne(inversorId);
      const activo = await this.activoService.findOne(dto.activoId);
      // establece el costo total de la transaccion
      const costoTotal = activo.precioActual * dto.cantidad;
      if (inversor.saldoVirtual < costoTotal) throw new BadRequestException('Saldo insuficiente');
      const portafolio = await this.inversorService.findPortafolio(inversorId);
      // verifica la tenencia, si existe, suma la cantidad, si no, la crea
      await this.verificarTenenciaCompra(portafolio!, activo, dto.cantidad);

      inversor.saldoVirtual -= costoTotal; // restamos saldo
      inversor.portafolio.costoPortafolio = Number((inversor.portafolio.costoPortafolio + costoTotal).toFixed(2)); // sumamos valor del portafolio

      // creamos transaccion
      const nuevaTransaccion = await this.transaccionService.create(TipoTransaccion.COMPRA, dto.cantidad, costoTotal, portafolio, activo)
      // actualizamos el precio
      await this.activoService.actualizarActivo(activo, dto.cantidad, TipoTransaccion.COMPRA);
      // guardamos
      await this.inversorRepo.save(inversor);

      return {
        cantidad: nuevaTransaccion.cantidad,
        fecha: nuevaTransaccion.fecha,
        precioEjecutado: nuevaTransaccion.precioEjecutado,
        TipoTransaccion: nuevaTransaccion.tipoTransaccion
      };
    } catch (error) {
      throw error;
    }
  }

  async procesarVenta(dto: VentaActivoDto, inversorId: number) {
    try {
      const inversor = await this.inversorService.findOne(inversorId);
      const activo = await this.activoService.findOne(dto.activoId);
      const portafolio = await this.inversorService.findPortafolio(inversorId);

      const tenencia = portafolio.tenencias.find(t => t.activo.id === activo.id);
      if (!tenencia) throw new BadRequestException('No posees este activo en tu portafolio.');
      const precioCompra = tenencia.precioCompra;

      await this.verificarTenenciaVenta(portafolio!, activo, dto.cantidad)

      const ingresoVenta = activo.precioActual * dto.cantidad;
      const costoVendido = precioCompra * dto.cantidad;
      
      inversor.saldoVirtual += ingresoVenta;
      inversor.portafolio.costoPortafolio = Number((inversor.portafolio.costoPortafolio - costoVendido).toFixed(2));

      const nuevaTransaccion = await this.transaccionService.create(TipoTransaccion.VENTA, dto.cantidad, ingresoVenta, portafolio, activo)

      await this.activoService.actualizarActivo(activo, dto.cantidad, TipoTransaccion.VENTA);

      await this.inversorRepo.save(inversor);

      return {
        cantidad: nuevaTransaccion.cantidad,
        fecha: nuevaTransaccion.fecha,
        precioEjecutado: nuevaTransaccion.precioEjecutado,
        TipoTransaccion: nuevaTransaccion.tipoTransaccion
      };
    } catch (error) {
      throw error;
    }
  }

  async verificarTenenciaCompra(portafolio: Portafolio, activo: Activo, cantidadCompra: number) {
    const tenenciaExistente = portafolio.tenencias.find(t => t.activo.id === activo.id);

    if (tenenciaExistente) {
      const cantidadAnterior = tenenciaExistente.cantidad;
      const precioCompraAnterior = tenenciaExistente.precioCompra;

      tenenciaExistente.cantidad += cantidadCompra;
      tenenciaExistente.precioCompra = ((precioCompraAnterior * cantidadAnterior) + (activo.precioActual * cantidadCompra)) / (cantidadAnterior + cantidadCompra);
      await this.tenenciaRepo.save(tenenciaExistente);
    } else {
      const nuevaTenencia = this.tenenciaRepo.create({
        cantidad: cantidadCompra,
        precioCompra: activo.precioActual,
        portafolio: portafolio,
        activo: activo,
      });
      await this.tenenciaRepo.save(nuevaTenencia);
    }
  }

  async verificarTenenciaVenta(portafolio: Portafolio, activo: Activo, cantidadCompra: number) {
    const tenenciaExistente = portafolio.tenencias.find(t => t.activo.id === activo.id);
    if (tenenciaExistente && tenenciaExistente.cantidad >= cantidadCompra) {
      tenenciaExistente.cantidad -= cantidadCompra;
      if (tenenciaExistente.cantidad === 0) {
        return await this.tenenciaRepo.remove(tenenciaExistente);
      }
      return this.tenenciaRepo.save(tenenciaExistente);
    }
    throw new BadRequestException('Cantidad de activos insuficiente.')
  }
}