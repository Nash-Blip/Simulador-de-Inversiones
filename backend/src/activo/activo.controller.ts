import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req, Patch } from '@nestjs/common';
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
import { ActivoListItemDto } from './dto/output/activo-list-item.dto';
import { ActivoDetailDto } from './dto/output/activo-detail.dto';

@ApiTags('Activo')
@ApiBearerAuth()
@Controller('activo')
export class ActivoController {
  constructor(
    private readonly activoService: ActivoService,
    private readonly sistema: Sistema,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo activo (ADMIN)' })
  @ApiCreatedResponse({ type: ActivoListItemDto })
  create(@Body() createActivoDto: CreateActivoDto) {
    return this.activoService.create(createActivoDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiOperation({ summary: 'Actualizar un activo (ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: ActivoListItemDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateActivoDto: UpdateActivoDto) {
    return this.activoService.update(id, updateActivoDto);
  }

  @Post('comprar')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Comprar un activo' })
  @ApiCreatedResponse({
    schema: {
      properties: {
        cantidad: { type: 'number', example: 10 },
        fecha: { type: 'string', format: 'date-time', example: '2026-06-11T12:00:00.000Z' },
        precioEjecutado: { type: 'number', example: 155.50 },
        TipoTransaccion: { type: 'string', example: 'COMPRA' },
      },
    },
  })
  comprar(@Body() compraDto: CompraActivoDto, @Req() req: Request) {
    return this.sistema.procesarCompra(compraDto, (req as any).user.id);
  }

  @Post('vender')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Vender un activo' })
  @ApiCreatedResponse({
    schema: {
      properties: {
        cantidad: { type: 'number', example: 10 },
        fecha: { type: 'string', format: 'date-time', example: '2026-06-11T12:00:00.000Z' },
        precioEjecutado: { type: 'number', example: 155.50 },
        TipoTransaccion: { type: 'string', example: 'VENTA' },
      },
    },
  })
  vender(@Body() ventaDto: VentaActivoDto, @Req() req: Request) {
    return this.sistema.procesarVenta(ventaDto, (req as any).user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos los activos' })
  @ApiOkResponse({ type: ActivoListItemDto, isArray: true })
  findAll() {
    return this.activoService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener un activo por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: ActivoDetailDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.activoService.findOne(id);
  }
}
