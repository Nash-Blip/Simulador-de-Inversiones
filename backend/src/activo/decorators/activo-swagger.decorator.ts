import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ApiAdmin, ApiAuth, ApiIdParam } from '@/common/decorators/swagger.decorator';
import { ActivoListItemDto } from '../dto/output/activo-list-item.dto';
import { ActivoDetailDto } from '../dto/output/activo-detail.dto';

export function ApiCreateActivo() {
  return applyDecorators(
    ApiOperation({ summary: 'Crear un nuevo activo (ADMIN)' }),
    ApiCreatedResponse({ type: ActivoListItemDto }),
    ApiAdmin(),
    ApiBadRequestResponse({ description: 'Datos inválidos (nombre, ticker, precioInicial)' }),
    ApiConflictResponse({ description: 'El Activo {nombre} ya existe.' }),
  );
}

export function ApiUpdateActivo() {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar un activo (ADMIN)' }),
    ApiOkResponse({ type: ActivoListItemDto }),
    ApiAdmin(),
    ApiIdParam(),
    ApiBadRequestResponse({ description: 'ID inválido o datos inválidos' }),
    ApiNotFoundResponse({ description: 'No se encontró el Activo con ID {id}' }),
  );
}

export function ApiComprarActivo() {
  return applyDecorators(
    ApiOperation({ summary: 'Comprar un activo' }),
    ApiCreatedResponse({
      schema: {
        properties: {
          cantidad: { type: 'number', example: 10 },
          fecha: { type: 'string', format: 'date-time', example: '2026-06-11T12:00:00.000Z' },
          precioEjecutado: { type: 'number', example: 155.50 },
          TipoTransaccion: { type: 'string', example: 'COMPRA' },
        },
      },
    }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Datos inválidos o saldo insuficiente' }),
    ApiNotFoundResponse({ description: 'Activo con id {id} no encontrado.' }),
  );
}

export function ApiVenderActivo() {
  return applyDecorators(
    ApiOperation({ summary: 'Vender un activo' }),
    ApiCreatedResponse({
      schema: {
        properties: {
          cantidad: { type: 'number', example: 10 },
          fecha: { type: 'string', format: 'date-time', example: '2026-06-11T12:00:00.000Z' },
          precioEjecutado: { type: 'number', example: 155.50 },
          TipoTransaccion: { type: 'string', example: 'VENTA' },
        },
      },
    }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Datos inválidos, activo no poseído o cantidad insuficiente' }),
    ApiNotFoundResponse({ description: 'Activo con id {id} no encontrado.' }),
  );
}

export function ApiFindAllActivos() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todos los activos' }),
    ApiOkResponse({ type: ActivoListItemDto, isArray: true }),
    ApiAuth(),
  );
}

export function ApiFindOneActivo() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un activo por ID' }),
    ApiOkResponse({ type: ActivoDetailDto }),
    ApiAuth(),
    ApiIdParam(),
    ApiBadRequestResponse({ description: 'ID inválido (se espera un número)' }),
    ApiNotFoundResponse({ description: 'Activo con id {id} no encontrado.' }),
  );
}
