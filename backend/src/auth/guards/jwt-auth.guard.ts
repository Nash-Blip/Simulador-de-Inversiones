import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly moduleRef: ModuleRef) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isValid = (await super.canActivate(context)) as boolean;
        if (!isValid) return false;
        const jwtService = this.moduleRef.get(JwtService, { strict: false });
        const req = context.switchToHttp().getRequest();
        const res: Response = context.switchToHttp().getResponse();
        const user = req.user;
        const newToken = jwtService.sign(
            { id: user.id, rol: user.rol },
            { expiresIn: '10m' },
        );
        res.cookie('token', newToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 10 * 60 * 1000,
        });
        return true;
    }
}