// finnhub.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinnhubService } from './finnhub.service';
import { Activo } from '../activo/entities/activo.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Activo]), 
  ],
  providers: [FinnhubService],
  exports: [FinnhubService], 
})
export class FinnhubModule {}