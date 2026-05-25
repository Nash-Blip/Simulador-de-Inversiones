import { Module, OnModuleInit } from '@nestjs/common';
import { InversorService } from './inversor.service';
import { InversorController } from './inversor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inversor } from './entities/inversor.entity';
import { Portafolio } from '@/portafolio/portafolio.entity';

@Module({
  controllers: [InversorController],
  providers: [InversorService],
  imports: [TypeOrmModule.forFeature([Inversor, Portafolio,])],
  exports: [InversorService, TypeOrmModule],
})
export class InversorModule implements OnModuleInit {
  constructor(private readonly inversorService: InversorService) {}
  onModuleInit() {}
}
