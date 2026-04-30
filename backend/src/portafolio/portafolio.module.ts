// portafolio.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Portafolio } from "./entities/portafolio.entity";
import { PortafolioService } from "./portafolio.service";
import { PortafolioController } from "./portafolio.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Portafolio])],
    controllers: [PortafolioController],
    providers: [PortafolioService],
    exports: [PortafolioService],
})
export class PortafolioModule {}