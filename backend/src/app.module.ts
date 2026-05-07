import { Module } from '@nestjs/common';
import { SistemaModule } from './sistema/sistema.module';

@Module({
  imports: [SistemaModule]
})
export class AppModule {}
