import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InversorService } from './inversor.service';
import { CreateInversorDto } from './dto/create-inversor.dto';


@Controller('inversor')
export class InversorController {
  constructor(private readonly inversorService: InversorService) {}

  @Post()
  create(@Body() createInversorDto: CreateInversorDto) {
    return this.inversorService.create(createInversorDto);
  }

  @Get()
  findAll() {
    return this.inversorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inversorService.findOne(id);
  }

  @Get('portafolio/:id')
  findPortafolio(@Param('id', ParseIntPipe) id: number){
    return this.inversorService.findPortafolio(id)
  }
}
