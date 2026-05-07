import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { UpdateActivoDto } from './dto/update-activo.dto';
import { ComprarActivoDto } from './dto/comprar-activo.dto';


@Controller('activo')
export class ActivoController {
  constructor(private readonly activoService: ActivoService) {}

  @Post()
  create(@Body() createActivoDto: CreateActivoDto) {
    return this.activoService.create(createActivoDto);
  }

  @Get()
  findAll() {
    return this.activoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivoDto: UpdateActivoDto) {
    return this.activoService.update(+id, updateActivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activoService.remove(+id);
  }

  // @Post('comprar')
  // async comprar(@Body() dto: ComprarActivoDto, @Req() req) {
  //   const usuarioId = req.user.id;
  //   return this.activoService.procesarCompra(dto.activoId, dto.cantidad, usuarioId);
  // }

}
