import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req, Patch } from '@nestjs/common';
import type { Request } from 'express';
import { InversorService } from './inversor.service';
import { CreateInversorDto } from './dto/input/create-inversor.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';
import { IngresarFondosTarjetaDto } from './dto/input/ingresar-fondos-tarjeta.dto';
import { IngresarFondosTransferenciaDto } from './dto/input/ingresar-fondos-transferencia.dto';
import { RetirarFondosDto } from './dto/input/retirar-fondos.dto';
import { CambioPasswordDto } from './dto/input/cambio-password.dto';
import { PortafolioResponseDto } from './dto/output/portafolio-response.dto';
import { InversorListItemDto } from './dto/output/inversor-list-item.dto';
import { InversorPerfilDto } from './dto/input/inversor.perfil.dto';

@ApiTags('Inversor')
@ApiBearerAuth()
@Controller('inversor')
export class InversorController {
  constructor(private readonly inversorService: InversorService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiOperation({ summary: 'Crear un inversor (ADMIN)' })
  @ApiCreatedResponse({ type: InversorListItemDto })
  create(@Body() createInversorDto: CreateInversorDto) {
    return this.inversorService.create(createInversorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiOperation({ summary: 'Listar todos los inversores (ADMIN)' })
  @ApiOkResponse({ type: InversorListItemDto, isArray: true })
  findAll() {
    return this.inversorService.findAll();
  }

  @Get('portafolio')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener portafolio del inversor autenticado' })
  @ApiOkResponse({ type: PortafolioResponseDto })
  findMyPortafolio(@Req() req: Request) {
    return this.inversorService.findPortafolio((req as any).user.id);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener perfil del inversor autenticado' })
  @ApiOkResponse({ type: InversorPerfilDto })
  findPerfil(@Req() req: Request) {
    return this.inversorService.findPerfil((req as any).user.id)
  }

  @Patch('cambiar-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cambiar contraseña del inversor autenticado' })
  @ApiOkResponse({
    schema: {
      properties: {
        message: { type: 'string', example: 'Contraseña actualizada con éxito.' },
      },
    },
  })
  async cambiarPassword(
    @Req() req: Request,
    @Body() cambiarPasswordDto: CambioPasswordDto,
  ) {
    return this.inversorService.cambiarPassword((req as any).user.id, cambiarPasswordDto);
  }

  @Post('ingresar-fondos-tarjeta')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ingresar fondos del inversor autenticado con tarjeta' })
  @ApiCreatedResponse({
    schema: {
      properties: {
        mensaje: { type: 'string', example: 'Fondos ingresados correctamente' },
        saldoActual: { type: 'number', example: 10500.00 },
      },
    },
  })
  ingresarFondosTarjeta(@Req() req, @Body() dto: IngresarFondosTarjetaDto) {
    return this.inversorService.ingresarFondosTarjeta((req as any).user.id, dto);
  }

  @Post('ingresar-fondos-transferencia')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Ingresar fondos del inversor autenticado por transferencia bancaria' })
  @ApiCreatedResponse({
    schema: {
      properties: {
        mensaje: { type: 'string', example: 'Fondos ingresados correctamente' },
        saldoActual: { type: 'number', example: 10500.00 },
      },
    },
  })
  ingresarFondosTransferencia(@Req() req, @Body() dto: IngresarFondosTransferenciaDto) {
    return this.inversorService.ingresarFondosTransferencia((req as any).user.id, dto);
  }

  @Post('retirar-fondos')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retirar fondos del inversor autenticado' })
  @ApiCreatedResponse({
    schema: {
      properties: {
        mensaje: { type: 'string', example: 'Fondos retirados correctamente' },
        saldoActual: { type: 'number', example: 9500.00 },
      },
    },
  })
  retirarFondos(@Req() req, @Body() dto: RetirarFondosDto) {
    return this.inversorService.retirarFondos((req as any).user.id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiOperation({ summary: 'Obtener un inversor por ID (ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: InversorListItemDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findOne(id);
  }

  @Get('portafolio/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiOperation({ summary: 'Obtener portafolio de un inversor por ID (ADMIN)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: PortafolioResponseDto })
  findPortafolio(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findPortafolio(id)
  }
}
