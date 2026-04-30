import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { PortafolioService } from "./portafolio.service";

@Controller("portafolio")
export class PortafolioController {
    constructor(private readonly portafolioService: PortafolioService) {}

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.portafolioService.findOne(id);
    }

    @Get(":id/historial")
    getHistorial(@Param("id", ParseIntPipe) id: number) {
        return this.portafolioService.getHistorial(id);
    }

    @Get(":id/ganancia")
    getGananciaPerdida(@Param("id", ParseIntPipe) id: number) {
        return this.portafolioService.getGananciaPerdida(id);
    }
}
