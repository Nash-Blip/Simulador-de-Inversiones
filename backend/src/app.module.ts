import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivoModule } from './activo/activo.module';

@Module({
  imports: [ActivoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
