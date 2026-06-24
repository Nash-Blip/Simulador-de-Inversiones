import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
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
import {
  ApiFindAllInversores,
  ApiFindMyPortafolio,
  ApiFindPerfil,
  ApiCambiarPassword,
  ApiIngresarFondosTarjeta,
  ApiIngresarFondosTransferencia,
  ApiRetirarFondos,
  ApiFindOneInversor,
  ApiFindPortafolioById,
} from './decorators/inversor-swagger.decorator';

@ApiTags('Inversor')
@ApiBearerAuth()
@Controller('inversor')
export class InversorController {
  constructor(private readonly inversorService: InversorService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiFindAllInversores()
  findAll() {
    return this.inversorService.findAll();
  }

  @Get('portafolio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiFindMyPortafolio()
  findMyPortafolio(@Req() req: Request) {
    return this.inversorService.findPortafolio((req as any).user.id);
  }

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  @ApiFindPerfil()
  findPerfil(@Req() req: Request) {
    return this.inversorService.findPerfil((req as any).user.id)
  }

  @Patch('cambiar-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiCambiarPassword()
  async cambiarPassword(
    @Req() req: Request,
    @Body() cambiarPasswordDto: CambioPasswordDto,
  ) {
    return this.inversorService.cambiarPassword((req as any).user.id, cambiarPasswordDto);
  }

  @Post('ingresar-fondos-tarjeta')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiIngresarFondosTarjeta()
  ingresarFondosTarjeta(@Req() req, @Body() dto: IngresarFondosTarjetaDto) {
    return this.inversorService.ingresarFondosTarjeta((req as any).user.id, dto);
  }

  @Post('ingresar-fondos-transferencia')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiIngresarFondosTransferencia()
  ingresarFondosTransferencia(@Req() req, @Body() dto: IngresarFondosTransferenciaDto) {
    return this.inversorService.ingresarFondosTransferencia((req as any).user.id, dto);
  }

  @Post('retirar-fondos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.USER)
  @ApiRetirarFondos()
  retirarFondos(@Req() req, @Body() dto: RetirarFondosDto) {
    return this.inversorService.retirarFondos((req as any).user.id, dto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiFindOneInversor()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findOne(id);
  }

  @Get('portafolio/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(InversorRol.ADMIN)
  @ApiFindPortafolioById()
  findPortafolio(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findPortafolio(id)
  }
}

