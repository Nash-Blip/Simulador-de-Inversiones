import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req, Patch, Query } from '@nestjs/common';
import type { Request } from 'express';
import { ActivoService } from './activo.service';
import { CreateActivoDto } from './dto/input/create-activo.dto';
import { CompraActivoDto } from './dto/input/compra-activo.dto';
import { Sistema } from '@/sistema/sistema';
import { VentaActivoDto } from './dto/input/venta-activo.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';
import { UpdateActivoDto } from './dto/input/update-activo.dto';
import { ApiCreateActivo, ApiUpdateActivo, ApiComprarActivo, ApiVenderActivo, ApiFindAllActivos, ApiFindAllActivosList, ApiFindOneActivo } from './decorators/activo-swagger.decorator';
import { GetActivosQueryDto } from './dto/input/get-activo-query.dto';

@ApiTags('Activo')
@ApiBearerAuth()
@Controller('activo')
export class ActivoController {
  constructor(
    private readonly activoService: ActivoService,
    private readonly sistema: Sistema,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiCreateActivo()
  create(@Body() createActivoDto: CreateActivoDto) {
    return this.activoService.create(createActivoDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiUpdateActivo()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateActivoDto: UpdateActivoDto) {
    return this.activoService.update(id, updateActivoDto);
  }

  @Post('comprar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiComprarActivo()
  comprar(@Body() compraDto: CompraActivoDto, @Req() req: Request) {
    return this.sistema.procesarCompra(compraDto, (req as any).user.id);
  }

  @Post('vender')
  @UseGuards(JwtAuthGuard)
  @Roles(InversorRol.USER)
  @ApiVenderActivo()
  vender(@Body() ventaDto: VentaActivoDto, @Req() req: Request) {
    return this.sistema.procesarVenta(ventaDto, (req as any).user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiFindAllActivos()
  findAllPaginado(@Query() query: GetActivosQueryDto) {
    return this.activoService.findAllPaginado(query);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiFindAllActivosList()
  findAll() {
    return this.activoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiFindOneActivo()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activoService.findOne(id);
  }
}
