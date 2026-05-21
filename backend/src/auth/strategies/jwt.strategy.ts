import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { InversorService } from '@/inversor/inversor.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly inversorService: InversorService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request?.cookies?.token ?? null,
            ]),
            secretOrKey: configService.get<string>('JWT_SECRET')!,
        });
    }
    async validate(payload: { id: number; rol: string }) {
        const inversor = await this.inversorService.findOne(payload.id);
        if (!inversor) throw new UnauthorizedException();
        return inversor;
    }
}