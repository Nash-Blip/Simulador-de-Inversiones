import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { CompraActivoDto } from './dto/compra-activo.dto';
import { Sistema } from '@/sistema/sistema';

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

  @Get()
  findAll() {
    return this.activoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activoService.findOne(+id);
  }
}
