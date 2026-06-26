import { Injectable, BadRequestException } from '@nestjs/common';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { CompraActivoDto } from '@/activo/dto/input/compra-activo.dto';
import { VentaActivoDto } from '@/activo/dto/input/venta-activo.dto';
import { InversorService } from '@/inversor/inversor.service';
import { ActivoService } from '@/activo/activo.service';
import { TransaccionService } from '@/transaccion/transaccion.service';
import { TenenciaService } from '@/tenenciaActivo/tenencia.service';


@Injectable()
export class Sistema {
  constructor(
    private readonly tenenciaService: TenenciaService,
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
      await this.tenenciaService.verificarTenenciaCompra(portafolio, activo, dto.cantidad);

      // creamos transaccion
      const nuevaTransaccion = await this.transaccionService.create(TipoTransaccion.COMPRA, dto.cantidad, costoTotal, portafolio, activo)
      // actualizamos el precio
      await this.activoService.actualizarActivo(activo, dto.cantidad, TipoTransaccion.COMPRA);
      // guardamos
      await this.inversorService.registrarCompra(inversorId,costoTotal);

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
      const activo = await this.activoService.findOne(dto.activoId);
      const portafolio = await this.inversorService.findPortafolio(inversorId);

      await this.tenenciaService.verificarTenenciaVenta(portafolio, activo, dto.cantidad)
      const tenencia = portafolio.tenencias.find(t => t.activo.id === activo.id);
      // ya que vendemos al valor en el que el activo esta en el mercado, 
      // pero el costo del portafolio dismunulle segun el valor compra de la tenencia necesitamos estas dos variables.
      const ingresoVenta = activo.precioActual * dto.cantidad;
      const costoVendido = tenencia!.precioCompra * dto.cantidad;

      const nuevaTransaccion = await this.transaccionService.create(TipoTransaccion.VENTA, dto.cantidad, ingresoVenta, portafolio, activo)

      await this.activoService.actualizarActivo(activo, dto.cantidad, TipoTransaccion.VENTA);

      await this.inversorService.registrarVenta(inversorId,ingresoVenta,costoVendido);

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
}