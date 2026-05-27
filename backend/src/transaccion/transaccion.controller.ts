import { Controller, Get, UseGuards} from "@nestjs/common";
import { TransaccionService } from "./transaccion.service";
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@Controller('transaccion')
export class TransaccionController {
    constructor(private readonly transaccionService: TransaccionService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.transaccionService.findAll();
    }
}
