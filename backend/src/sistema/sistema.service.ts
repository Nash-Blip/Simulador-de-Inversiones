import { Injectable } from '@nestjs/common';
import { ComprarActivoDTO } from './dto/comprar-activo.dto';
import { Inversor } from './inversor/inversor.service.ts';
import { Activo } from './activo/activo.service.ts';
import { Transaccion } from './transaccion/transaccion.service.ts';
import { TipoTransaccion } from './transaccion';
import VenderActivoDto from './dto/vender-activo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SistemaService {
  constructor(
    @InjectRepository(Inversor)
    private readonly inversorRepo: Repository<Inversor>,
    @InjectRepository(Activo)
    private readonly activoRepo: Repository<Activo>,
    @InjectRepository(Transaccion)
    private readonly transaccionRepo: Repository<Transaccion>,
    ) {}

  async procesarCompra(comprarActivoDTO: ComprarActivoDTO){
    try{
      const inversor = await this.inversorRepo.findOneBy(comprarActivoDTO.idInversor);
      const activo = await this.activoRepo.findOneBy(comprarActivoDTO.idActivo);

      if(inversor.getSaldo() >= activo.getPrecio()){
        const transaccion = this.transaccionRepo.create({
          ticker: activo.getTicker(),
          tipoTransaccion: TipoTransaccion.compra,
          cantidad: comprarActivoDTO.cantidad,
          precio: activo.getPrecio(),
          fecha: new Date(),}
        )

        activo.registrarTransaccion(transaccion);
        inversor.getRegistrarCompra(activo.getPrecio()); // disminulle saldo
        inversor.getPortafolio().registrarTransaccion(transaccion);
        inversor.getPortafolio().registrarCompra(comprarActivoDTO.cantidad,activo);
        // guardamos cambios
        this.inversorRepo.save(inversor); 
        this.activoRepo.save(activo);
      }
      else {
        throw new Error("Saldo Insuficiente.")
      }

    } catch(error) {
      throw error
    }
  }
  
  async procesarVenta(venderActivoDTO: VenderActivoDto){
    try{
      const inversor = await this.inversorRepo.findOneBy(venderActivoDTO.idInversor);
      const activo = await this.activoRepo.findOneBy(venderActivoDTO.idActivo);
      
      if(inversor.getPortafolio().getTenencias(activo).getCantidad() >= venderActivoDTO.cantidad){
          const transaccion = this.transaccionRepo.create({
          ticker: activo.getTicker(),
          tipoTransaccion: TipoTransaccion.venta,
          cantidad: venderActivoDTO.cantidad,
          precio: activo.getPrecio(),
          fecha: new Date(),}
        )

        activo.registrarTransaccion(transaccion);
        inversor.getRegistrarVenta(activo.getPrecio()); // aumenta saldo
        inversor.getPortafolio().registrarTransaccion(transaccion);
        inversor.getPortafolio().registrarVenta(venderActivoDTO.cantidad,activo);
        this.inversorRepo.save(inversor); 
        this.activoRepo.save(activo);
      }

    } catch(error) {
      throw error
    }
  }


}
