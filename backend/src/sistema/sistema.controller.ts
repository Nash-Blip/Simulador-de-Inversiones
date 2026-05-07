import { Body, Controller, Post } from '@nestjs/common';
import { SistemaService } from './sistema.service';
import { ComprarActivoDTO } from './dto/comprar-activo.dto';
import VenderActivoDto from './dto/vender-activo.dto';

@Controller('sistema')
export class SistemaController {
  constructor(private readonly sistemaService: SistemaService) {}

  @Post('compra')
  procesarCompra(@Body() comprarActivoDTO:ComprarActivoDTO){
    this.sistemaService.procesarCompra(comprarActivoDTO)
  }

    @Post('venta')
  procesarVenta(@Body() venderActivoDTO:VenderActivoDto){
    this.sistemaService.procesarVenta(venderActivoDTO)
  }

}
