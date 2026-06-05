import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req, Patch } from '@nestjs/common';
import type { Request } from 'express';
import { InversorService } from './inversor.service';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';
import { IngresarFondosTarjetaDto } from './dto/ingresar-fondos-tarjeta.dto';
import { IngresarFondosTransferenciaDto } from './dto/ingresar-fondos-transferencia.dto';
import { RetirarFondosDto } from './dto/retirar-fondos.dto';
import { CambioPasswordDto } from './dto/cambio-password.dto';


@Controller('inversor')
export class InversorController {
  constructor(private readonly inversorService: InversorService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  create(@Body() createInversorDto: CreateInversorDto) {
    return this.inversorService.create(createInversorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  findAll() {
    return this.inversorService.findAll();
  }

  @Get('portafolio')
  @UseGuards(JwtAuthGuard)
  findMyPortafolio(@Req() req: Request) {
    return this.inversorService.findPortafolio((req as any).user.id);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  findPerfil(@Req() req: Request) {
    return this.inversorService.findPerfil((req as any).user.id)
  }

  @Patch('cambiar-password')
  @UseGuards(JwtAuthGuard)
  async cambiarPassword(
    @Req() req: Request,
    @Body() cambiarPasswordDto: CambioPasswordDto,
  ) {
    return this.inversorService.cambiarPassword((req as any).user.id, cambiarPasswordDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findOne(id);
  }

  @Get('portafolio/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  findPortafolio(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findPortafolio(id)
  }

  @Post('ingresar-fondos-tarjeta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  ingresarFondosTarjeta(@Req() req, @Body() dto: IngresarFondosTarjetaDto) {
    return this.inversorService.ingresarFondosTarjeta(req.user.id, dto);
  }

  @Post('ingresar-fondos-transferencia')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  ingresarFondosTransferencia(@Req() req,@Body() dto: IngresarFondosTransferenciaDto) {
    return this.inversorService.ingresarFondosTransferencia(req.user.id, dto);
  }

  @Post('retirar-fondos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  retirarFondos(@Req() req,@Body() dto: RetirarFondosDto) {
    return this.inversorService.retirarFondos(req.user.id,dto);
  }
}