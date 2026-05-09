import { Module } from '@nestjs/common';
import { InversorService } from './inversor.service';
import { InversorController } from './inversor.controller';

@Module({
  controllers: [InversorController],
  providers: [InversorService],
})
export class InversorModule {}
