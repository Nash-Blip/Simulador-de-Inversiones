import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransaccionModule } from './transaccion/transaccion.module';
import { PortafolioModule } from './portafolio/portafolio.module';

@Module({
  imports: [TransaccionModule, PortafolioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
