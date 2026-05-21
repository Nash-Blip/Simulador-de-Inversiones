import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { CreateActivoDto } from './dto/create-activo.dto';
import { CompraActivoDto } from './dto/compra-activo.dto';
import { Sistema } from '@/sistema/sistema';
import { VentaActivoDto } from './dto/venta-activo.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';

@Controller('activo')
export class ActivoController {
  constructor(
    private readonly activoService: ActivoService,
    private readonly sistema: Sistema,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  create(@Body() createActivoDto: CreateActivoDto) {
    return this.activoService.create(createActivoDto);
  }

  @Post('comprar')
  @UseGuards(JwtAuthGuard)
  comprar(@Body() compraDto: CompraActivoDto) {
    return this.sistema.procesarCompra(compraDto);
  }

  @Post('vender')
  @UseGuards(JwtAuthGuard)
  vender(@Body() ventaDto: VentaActivoDto) {
    return this.sistema.procesarVenta(ventaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.activoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activoService.findOne(id);
  }
}
