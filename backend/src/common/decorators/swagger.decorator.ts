import { applyDecorators } from '@nestjs/common';
import {
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiForbiddenResponse,
  ApiParam,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

export function ApiAuth() {
  return applyDecorators(
    ApiUnauthorizedResponse({ description: 'Token ausente o inválido' }),
    ApiInternalServerErrorResponse({ description: 'Error interno del servidor' }),
  );
}

export function ApiAdmin() {
  return applyDecorators(
    ApiAuth(),
    ApiForbiddenResponse({ description: 'No tenés permisos para acceder a este recurso.' }),
  );
}

export function ApiIdParam() {
  return ApiParam({ name: 'id', type: Number, example: 1 });
}

export function ApiInvalidIdResponse() {
  return ApiBadRequestResponse({ description: 'ID inválido (se espera un número)' });
}
