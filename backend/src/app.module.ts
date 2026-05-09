import { Module } from '@nestjs/common';
import { InversorModule } from './inversor/inversor.module';
import { ActivoModule } from './activo/activo.module';

@Module({
  imports: [InversorModule, ActivoModule]
})
export class AppModule {}
