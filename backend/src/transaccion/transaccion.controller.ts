import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Get, UseGuards, Req, Query } from "@nestjs/common";
import type { Request } from 'express';
import { TransaccionService } from "./transaccion.service";
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { InversorRol } from '@/inversor/entities/inversor.entity';
import { GetTransaccionesQueryDto } from "./dto/input/get-transaccion-query.dto";
import { TransaccionPaginadaResponseDto } from "./dto/output/transaccion-paginada-response.dto";

@ApiTags('Transaccion')
@ApiBearerAuth()
@Controller('transaccion')
export class TransaccionController {
    constructor(private readonly transaccionService: TransaccionService) {}

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(InversorRol.ADMIN)
    @ApiOperation({ summary: 'Listar todas las transacciones (ADMIN)' })
    @ApiOkResponse({ type: TransaccionPaginadaResponseDto })
    findAll(@Query() query: GetTransaccionesQueryDto) {
        return this.transaccionService.findAll(query);
    }

    @Get('historial')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener historial de transacciones del inversor autenticado' })
    @ApiOkResponse({ type: TransaccionPaginadaResponseDto })
    findHistorial(@Query() query: GetTransaccionesQueryDto, @Req() req: Request) {
        return this.transaccionService.findHistorialTransacciones((req as any).user.id, query);
    }
}
