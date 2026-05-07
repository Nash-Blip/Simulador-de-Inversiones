import { Module } from '@nestjs/common';
import { ActivoService } from './activo.service';
import { ActivoController } from './activo.controller';

@Module({
  controllers: [ActivoController],
  providers: [ActivoService],
})
export class ActivoModule {}
