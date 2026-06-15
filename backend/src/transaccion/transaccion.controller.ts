import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, UseGuards, Req, Query } from "@nestjs/common";
import type { Request } from 'express';
import { TransaccionService } from "./transaccion.service";
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';
import { GetTransaccionesQueryDto } from "./dto/input/get-transaccion-query.dto";
import { ApiFindAllTransacciones, ApiFindHistorial } from "./decorators/transaccion-swagger.decorator";

@ApiTags('Transaccion')
@ApiBearerAuth()
@Controller('transaccion')
export class TransaccionController {
    constructor(private readonly transaccionService: TransaccionService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(InversorRol.ADMIN)
    @ApiFindAllTransacciones()
    findAll(@Query() query: GetTransaccionesQueryDto) {
        return this.transaccionService.findAll(query);
    }

    @Get('historial')
    @UseGuards(JwtAuthGuard)
    @ApiFindHistorial()
    findHistorial(@Query() query: GetTransaccionesQueryDto, @Req() req: Request) {
        return this.transaccionService.findHistorialTransacciones((req as any).user.id, query);
    }
}
