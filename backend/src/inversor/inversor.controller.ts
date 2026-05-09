import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findOne(@Param('id') id: string) {
    return this.inversorService.findOne(+id);
  }
}
