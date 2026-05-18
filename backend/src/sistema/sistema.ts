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
import { error } from 'console';

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
    @InjectRepository(Portafolio)
    private readonly portafolioRepo: Repository<Portafolio>,

    private readonly inversorService: InversorService,
    private readonly activoService: ActivoService,
  ) {}

  async procesarCompra(dto: CompraActivoDto) {
    try {
      const inversor = await this.inversorService.findOne(dto.inversorId);
      const activo = await this.activoService.findOne(dto.activoId);
      // establece el costo total de la transaccion
      const costoTotal = activo.precioActual * dto.cantidad; 
      if (inversor.saldoVirtual < costoTotal) throw new BadRequestException('Saldo insuficiente');

      const portafolio = await this.inversorService.findPortafolio(dto.inversorId);
      const tenencia = this.verificarTenenciaCompra(portafolio,activo,dto);
    
      inversor.saldoVirtual -= costoTotal; // restamos saldo
      inversor.portafolio.valorPortafolio += costoTotal; // sumamos valor del portafolio

      // creamos transaccion
      const nuevaTransaccion = this.crearTransaccion(dto,costoTotal,portafolio,activo);

      // guardamos
      await this.portafolioRepo.save(portafolio);
      await this.inversorRepo.save(inversor);

      return { status: 'success', data: nuevaTransaccion };
    } catch (error) {
        throw error;
    }
  }

  verificarTenenciaCompra(portafolio: Portafolio, activo: Activo, dto: CompraActivoDto) {
    let tenencia: TenenciaActivo;
    portafolio.tenencias.forEach((t) => {
      if(t.activo === activo){
        t.cantidad += dto.cantidad;
        return t;
      }
    })
    tenencia = this.tenenciaRepo.create({
      cantidad: dto.cantidad,
      portafolio: portafolio,
      activo: activo,
    })     
    return tenencia; 
  }

  verificarTenenciaVenta(portafolio: Portafolio, activo: Activo, dto: VentaActivoDto) {
    portafolio.tenencias.forEach((t) => {
      if(t.activo === activo && t.cantidad >= dto.cantidad){
        t.cantidad -= dto.cantidad;
        if(t.cantidad === 0){
          this.tenenciaRepo.remove(t);
        }
        return t
      } else {
        throw new BadRequestException('tenencia inexistente.')
      }
    })
  }

  crearTransaccion(dto: CompraActivoDto | VentaActivoDto, costoTotal: number, portafolio: Portafolio, activo: Activo) {
    const transaccion = this.transaccionRepo.create({
      tipoTransaccion: TipoTransaccion.COMPRA,
      cantidad: dto.cantidad,
      precioEjecutado: costoTotal,
      portafolio: portafolio,
      activo: activo,
    });
    return transaccion;
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