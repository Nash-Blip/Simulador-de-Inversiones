// transaccion.controller.ts
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { TransaccionService } from "./transaccion.service";

@Controller("transaccion")
export class TransaccionController {
    constructor(private readonly transaccionService: TransaccionService) {}

    @Get()
    findAll() {
        return this.transaccionService.findAll();
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.transaccionService.findOne(id);
    }
}