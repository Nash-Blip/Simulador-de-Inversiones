import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';

export function ApiRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo inversor' }),
    ApiCreatedResponse({ description: 'Inversor registrado exitosamente. Token en cookie.' }),
    ApiBadRequestResponse({ description: 'Datos inválidos (email, nombre, password)' }),
    ApiConflictResponse({ description: 'El email ya está registrado.' }),
    ApiInternalServerErrorResponse({ description: 'Error interno del servidor' }),
  );
}

export function ApiLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar sesión' }),
    ApiOkResponse({ description: 'Login exitoso. Token en cookie.' }),
    ApiBadRequestResponse({ description: 'Faltan email o password' }),
    ApiUnauthorizedResponse({ description: 'Email o contraseña incorrectos.' }),
    ApiInternalServerErrorResponse({ description: 'Error interno del servidor' }),
    ApiBody({
      schema: {
        properties: {
          email: { type: 'string', example: 'usuario@mail.com' },
          password: { type: 'string', example: '123456' },
        },
        required: ['email', 'password'],
      },
    }),
  );
}

export function ApiLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Cerrar sesión' }),
    ApiOkResponse({ description: 'Cookie de token eliminada.' }),
    ApiInternalServerErrorResponse({ description: 'Error interno del servidor' }),
  );
}
