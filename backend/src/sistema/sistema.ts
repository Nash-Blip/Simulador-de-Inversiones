import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import {Repository } from 'typeorm';
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


@Injectable()
export class Sistema {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>,
    @InjectRepository(TenenciaActivo)
    private readonly tenenciaRepo: Repository<TenenciaActivo>,
    @InjectRepository(Transaccion)
    private readonly transaccionRepo: Repository<Transaccion>,
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    private readonly inversorService: InversorService,
    private readonly activoService: ActivoService,
  ) {}

  async procesarCompra(dto: CompraActivoDto, inversorId: number) {
    try {
      const inversor = await this.inversorService.findOne(inversorId);
      const activo = await this.activoService.findOne(dto.activoId);
      // establece el costo total de la transaccion
      const costoTotal = activo.precioActual * dto.cantidad; 
      if (inversor.saldoVirtual < costoTotal) throw new BadRequestException('Saldo insuficiente');
      const portafolio = await this.inversorService.findPortafolio(inversorId);
      // verifica la tenencia, si existe, suma la cantidad, si no, la crea
      await this.verificarTenenciaCompra(portafolio!,activo,dto.cantidad);
      
      inversor.saldoVirtual -= costoTotal; // restamos saldo
      inversor.portafolio.valorPortafolio += costoTotal; // sumamos valor del portafolio

      // creamos transaccion
      const nuevaTransaccion = await this.crearTransaccion(dto,costoTotal,TipoTransaccion.COMPRA,portafolio!,activo);
      // actualizamos el precio
      await this.activoService.actualizarPrecioActivo(activo,dto.cantidad,TipoTransaccion.COMPRA);
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

  async procesarVenta(dto: VentaActivoDto, inversorId: number){
    try{
      const inversor = await this.inversorService.findOne(inversorId);
      const activo = await this.activoService.findOne(dto.activoId);
      const portafolio = await this.inversorService.findPortafolio(inversorId);

      await this.verificarTenenciaVenta(portafolio!,activo,dto.cantidad)

      const gananciaTotal = activo.precioActual * dto.cantidad; 
      inversor.saldoVirtual += gananciaTotal;
      inversor.portafolio.valorPortafolio -= gananciaTotal;

      const nuevaTransaccion = await this.crearTransaccion(dto,gananciaTotal,TipoTransaccion.VENTA,portafolio!,activo);

      await this.activoService.actualizarPrecioActivo(activo,dto.cantidad,TipoTransaccion.COMPRA);
      
      await this.inversorRepo.save(inversor);
      
      return {
        cantidad: nuevaTransaccion.cantidad,
        fecha: nuevaTransaccion.fecha,
        precioEjecutado: nuevaTransaccion.precioEjecutado,
        TipoTransaccion: nuevaTransaccion.tipoTransaccion
      };
    } catch(error) {
      throw error;
    }
  }  

  async verificarTenenciaCompra(portafolio: Portafolio, activo: Activo, cantidadCompra: number) {
    const tenenciaExistente = portafolio.tenencias.find(t => t.activo.id === activo.id);
    // Si existe, actualizamos la cantidad
    if (tenenciaExistente) {
      tenenciaExistente.cantidad += cantidadCompra;
      await this.tenenciaRepo.save(tenenciaExistente);
    } else {
      // Si no existe, creamos la nueva
      const nuevaTenencia = this.tenenciaRepo.create({
        cantidad: cantidadCompra,
        portafolio: portafolio,
        activo: activo,
      });
      await this.tenenciaRepo.save(nuevaTenencia);
    }
  }

  async crearTransaccion(dto: CompraActivoDto | VentaActivoDto, precioEjecutado: number, tipoTransaccion: TipoTransaccion, portafolio: Portafolio, activo: Activo) {
    const transaccion = this.transaccionRepo.create({
      tipoTransaccion: tipoTransaccion,
      cantidad: dto.cantidad,
      precioEjecutado: precioEjecutado,
      portafolio: portafolio,
      activo: activo,
    });
    return await this.transaccionRepo.save(transaccion);
  }

  async verificarTenenciaVenta(portafolio: Portafolio, activo: Activo, cantidadCompra: number) {
    const tenenciaExistente = portafolio.tenencias.find(t => t.activo.id === activo.id);
    if(tenenciaExistente && tenenciaExistente.cantidad >= cantidadCompra) {
      tenenciaExistente.cantidad -= cantidadCompra;
      if(tenenciaExistente.cantidad === 0){
        return await this.tenenciaRepo.remove(tenenciaExistente);
      }
      return this.tenenciaRepo.save(tenenciaExistente);
    }
    throw new BadRequestException('Cantidad de activos insuficiente.')
  }
}