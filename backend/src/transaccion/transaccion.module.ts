import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransaccionController } from './transaccion.controller';
import { TransaccionService } from './transaccion.service';
import { Transaccion } from './transaccion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Transaccion]),TransaccionModule],
  controllers: [TransaccionController],
  providers: [TransaccionService],
  exports: [TransaccionService],
})
export class TransaccionModule {}