import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateInversorDto } from '@/inversor/dto/input/create-inversor.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo inversor' })
    @ApiCreatedResponse({ description: 'Inversor registrado exitosamente. Token en cookie.' })
    async register(
        @Body() dto: CreateInversorDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, inversor } = await this.authService.register(dto);
        res.cookie('token', accessToken, {
            httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000,
        });
        return { message: 'Registro exitoso', inversor };
    }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiOkResponse({ description: 'Login exitoso. Token en cookie.' })
    @ApiBody({
        schema: {
            properties: {
                email: { type: 'string', example: 'usuario@mail.com' },
                password: { type: 'string', example: '123456' },
            },
            required: ['email', 'password'],
        },
    })
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const inversor = await this.authService.validateUser(body.email, body.password);
        const { accessToken } = this.authService.login(inversor);
        res.cookie('token', accessToken, {
            httpOnly: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000,
        });
        return { message: 'Login exitoso', inversor };
    }

    @Post('logout')
    @ApiOperation({ summary: 'Cerrar sesión' })
    @ApiOkResponse({ description: 'Cookie de token eliminada.' })
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
        return { message: 'Sesión cerrada exitosamente' };
    }
}
