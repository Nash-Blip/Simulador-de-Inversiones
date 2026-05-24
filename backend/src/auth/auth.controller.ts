import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateInversorDto } from '@/inversor/dto/create-inversor.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(
        @Body() dto: CreateInversorDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, inversor } = await this.authService.register(dto);

        res.cookie('token', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return { message: 'Registro exitoso', inversor };
    }

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response,
    ) {
        const inversor = await this.authService.validateUser(body.email, body.password);
        const { accessToken } = this.authService.login(inversor);

        res.cookie('token', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        return { message: 'Login exitoso', inversor };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
        return { message: 'Sesión cerrada exitosamente' };
    }
}