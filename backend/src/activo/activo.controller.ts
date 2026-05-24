import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
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
  comprar(@Body() compraDto: CompraActivoDto, @Req() req: Request) {
    return this.sistema.procesarCompra(compraDto, (req as any).user.id);
  }

  @Post('vender')
  @UseGuards(JwtAuthGuard)
  vender(@Body() ventaDto: VentaActivoDto, @Req() req: Request) {
    return this.sistema.procesarVenta(ventaDto, (req as any).user.id,);
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
