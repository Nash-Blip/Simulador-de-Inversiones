import { Activo } from "@/activo/entities/activo.entity";
import { Portafolio } from "@/portafolio/portafolio.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TenenciaActivo } from "./tenenciaActivo.entity";
import { Repository } from "typeorm";

@Injectable()
export class TenenciaService {
  constructor(
    @InjectRepository(TenenciaActivo)
    private readonly tenenciaRepo: Repository<TenenciaActivo>
  ) { }

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