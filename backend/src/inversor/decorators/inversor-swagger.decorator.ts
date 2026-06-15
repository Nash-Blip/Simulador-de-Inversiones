import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { ApiAdmin, ApiAuth, ApiIdParam, ApiInvalidIdResponse } from '@/common/decorators/swagger.decorator';
import { InversorListItemDto } from '../dto/output/inversor-list-item.dto';
import { PortafolioResponseDto } from '../dto/output/portafolio-response.dto';
import { InversorPerfilDto } from '../dto/input/inversor.perfil.dto';

export function ApiFindAllInversores() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar todos los inversores (ADMIN)' }),
    ApiOkResponse({ type: InversorListItemDto, isArray: true }),
    ApiAdmin(),
  );
}

export function ApiFindMyPortafolio() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener portafolio del inversor autenticado' }),
    ApiOkResponse({ type: PortafolioResponseDto }),
    ApiAuth(),
  );
}

export function ApiFindPerfil() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener perfil del inversor autenticado' }),
    ApiOkResponse({ type: InversorPerfilDto }),
    ApiAuth(),
  );
}

export function ApiCambiarPassword() {
  return applyDecorators(
    ApiOperation({ summary: 'Cambiar contraseña del inversor autenticado' }),
    ApiOkResponse({
      schema: {
        properties: {
          message: { type: 'string', example: 'Contraseña actualizada con éxito.' },
        },
      },
    }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Datos inválidos (passwordActual, passwordNueva)' }),
    ApiConflictResponse({ description: 'La contraseña actual es incorrecta.' }),
  );
}

export function ApiIngresarFondosTarjeta() {
  return applyDecorators(
    ApiOperation({ summary: 'Ingresar fondos del inversor autenticado con tarjeta' }),
    ApiCreatedResponse({
      schema: {
        properties: {
          mensaje: { type: 'string', example: 'Fondos ingresados correctamente' },
          saldoActual: { type: 'number', example: 10500.00 },
        },
      },
    }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Datos inválidos o tarjeta inválida' }),
  );
}

export function ApiIngresarFondosTransferencia() {
  return applyDecorators(
    ApiOperation({ summary: 'Ingresar fondos del inversor autenticado por transferencia bancaria' }),
    ApiCreatedResponse({
      schema: {
        properties: {
          mensaje: { type: 'string', example: 'Fondos ingresados correctamente' },
          saldoActual: { type: 'number', example: 10500.00 },
        },
      },
    }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Datos inválidos (monto, cbu, titular)' }),
  );
}

export function ApiRetirarFondos() {
  return applyDecorators(
    ApiOperation({ summary: 'Retirar fondos del inversor autenticado' }),
    ApiCreatedResponse({
      schema: {
        properties: {
          mensaje: { type: 'string', example: 'Fondos retirados correctamente' },
          saldoActual: { type: 'number', example: 9500.00 },
        },
      },
    }),
    ApiAuth(),
    ApiBadRequestResponse({ description: 'Datos inválidos o fondos insuficientes' }),
  );
}

export function ApiFindOneInversor() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un inversor por ID (ADMIN)' }),
    ApiOkResponse({ type: InversorListItemDto }),
    ApiAdmin(),
    ApiIdParam(),
    ApiInvalidIdResponse(),
    ApiNotFoundResponse({ description: 'Inversor con id {id} no encontrado.' }),
  );
}

export function ApiFindPortafolioById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener portafolio de un inversor por ID (ADMIN)' }),
    ApiOkResponse({ type: PortafolioResponseDto }),
    ApiAdmin(),
    ApiIdParam(),
    ApiInvalidIdResponse(),
    ApiNotFoundResponse({ description: 'Inversor con id {id} no encontrado.' }),
  );
}
