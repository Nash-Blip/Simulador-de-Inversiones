// transaccion.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaccion } from "./entities/transaccion.entity";
import { TransaccionService } from "./transaccion.service";
import { TransaccionController } from "./transaccion.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Transaccion])],
    controllers: [TransaccionController],
    providers: [TransaccionService],
    exports: [TransaccionService],
})
export class TransaccionModule {}