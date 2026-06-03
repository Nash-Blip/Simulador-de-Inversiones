import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Req, Patch } from '@nestjs/common';
import type { Request } from 'express';
import { InversorService } from './inversor.service';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';
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
    console.log('Usuario en Request:', (req as any).user);
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



}
