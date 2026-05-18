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
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    @InjectRepository(TenenciaActivo)
    private readonly tenenciaRepo: Repository<TenenciaActivo>,
    @InjectRepository(Transaccion)
    private readonly transaccionRepo: Repository<Transaccion>,
    private readonly inversorService: InversorService,
    private readonly activoService: ActivoService,
  ) {}

  async procesarCompra(dto: CompraActivoDto) {
    try {
      const inversor = await this.inversorService.findOne(dto.inversorId);
      const activo = await this.activoService.findOne(dto.activoId);
      const portafolio = await this.inversorService.findPortafolio(dto.inversorId);
      const tenencia = this.verificarTenencia(portafolio,activo,dto);

      // establece el costo total de la transaccion
      const costoTotal = activo.precioActual * dto.cantidad; 
      if (inversor.saldoVirtual < costoTotal) throw new BadRequestException('Saldo insuficiente');

      inversor!.saldoVirtual -= costoTotal; // restamos saldo
      inversor!.portafolio.valorPortafolio += costoTotal; // sumamos valor del portafolio

      // creamos transaccion
      const nuevaTransaccion = this.transaccionRepo.create({
        tipoTransaccion: TipoTransaccion.COMPRA,
        cantidad: dto.cantidad,
        precioEjecutado: costoTotal,
        portafolio: inversor!.portafolio,
        activo: activo,
      });

      // guardamos
      await this.tenenciaRepo.save(tenencia!);
      await this.inversorRepo.save(inversor!);
      await this.transaccionRepo.save(nuevaTransaccion);

      return { status: 'success', data: nuevaTransaccion };
    } catch (error) {
        throw error;
    }
  }

  verificarTenencia(portafolio: Portafolio, activo: Activo, dto: CompraActivoDto | VentaActivoDto) {
    let tenencia: TenenciaActivo;
    portafolio.tenencias.forEach((t) => {
      if(t.activo === activo){
        tenencia = t
        tenencia.cantidad += dto.cantidad;
        return tenencia;
      }
    })
    tenencia = this.tenenciaRepo.create({
      cantidad: dto.cantidad,
      portafolio: portafolio,
      activo: activo,
    })     
    return tenencia; 
  }

  async procesarVenta(dto: VentaActivoDto){
    try{
      const inversor = await this.inversorRepo.findOne({
        where: { id: dto.inversorId },
        relations: ['portafolio']
      });
      if (!inversor) throw new NotFoundException('El inversor no existe');

      const activo = await this.activoRepo.findOneBy({ id: dto.activoId });
      if (!activo) throw new NotFoundException('El activo no existe');

      let tenencia = await this.tenenciaRepo.findOne({
        where: {
          portafolio: { id: inversor.portafolio.id },
          activo: { id: dto.activoId }
        }
      });
      if (!tenencia || tenencia.cantidad < dto.cantidad) {
        throw new BadRequestException('No tienes suficientes activos para vender');
      }

      tenencia.cantidad -= dto.cantidad;
      // si con la venta la tenencia llego a cero, la eliminamos
      if (tenencia.cantidad === 0) {
        await this.tenenciaRepo.remove(tenencia);
      } else {
        await this.tenenciaRepo.save(tenencia);
      }

      const gananciaTotal = activo.precioActual * dto.cantidad;
      inversor.saldoVirtual += gananciaTotal;
      inversor.portafolio.valorPortafolio -= gananciaTotal;

      const nuevaTransaccion = this.transaccionRepo.create({
        tipoTransaccion: TipoTransaccion.VENTA,
        cantidad: dto.cantidad,
        precioEjecutado: gananciaTotal,
        portafolio: inversor.portafolio,
        activo: activo,
      });

      await this.inversorRepo.save(inversor);
      await this.transaccionRepo.save(nuevaTransaccion);

      return { status: 'success', data: nuevaTransaccion };
    }catch(error){
        throw error;
    }
  }
}