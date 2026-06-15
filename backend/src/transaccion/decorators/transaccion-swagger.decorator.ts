import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ApiAdmin, ApiAuth } from '@/common/decorators/swagger.decorator';
import { TransaccionPaginadaResponseDto } from '../dto/output/transaccion-paginada-response.dto';

export function ApiFindAllTransacciones() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todas las transacciones (ADMIN)' }),
    ApiOkResponse({ type: TransaccionPaginadaResponseDto }),
    ApiAdmin(),
    ApiBadRequestResponse({ description: 'Parámetros inválidos (page, search, tipoTransaccion, fechaInicio, fechaFin)' }),
  );
}

export function ApiFindHistorial() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener historial de transacciones del inversor autenticado' }),
    ApiOkResponse({ type: TransaccionPaginadaResponseDto }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Parámetros inválidos (page, search, tipoTransaccion, fechaInicio, fechaFin)' }),
  );
}
