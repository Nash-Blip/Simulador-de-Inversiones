import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { CompraActivoDto } from './dto/compra-activo.dto';
import { Sistema } from '@/sistema/sistema';
import { VentaActivoDto } from './dto/venta-activo.dto';

@Controller('activo')
export class ActivoController {
  constructor(
    private readonly activoService: ActivoService,
    private readonly sistema: Sistema,
  ) {}

  @Post()
  create(@Body() createActivoDto: CreateActivoDto) {
    return this.activoService.create(createActivoDto);
  }

  @Post('comprar')
  comprar(@Body() compraDto: CompraActivoDto) {
    return this.sistema.procesarCompra(compraDto);
  }

  @Post('vender')
  vender(@Body() ventaDto: VentaActivoDto) {
    return this.sistema.procesarVenta(ventaDto);
  }

  @Get()
  findAll() {
    return this.activoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activoService.findOne(id);
  }
}
