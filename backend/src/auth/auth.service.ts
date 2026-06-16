import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InversorService } from '@/inversor/inversor.service';
import { CreateInversorDto } from '@/inversor/dto/input/create-inversor.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly inversorService: InversorService,
        private readonly jwtService: JwtService,
    ) {}

    async register(dto: CreateInversorDto) {
        const inversor = await this.inversorService.create(dto);
        const payload = { id: inversor.id, rol: inversor.rol };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken, inversor };
    }

    async validateUser(email: string, password: string) {
        const inversor = await this.inversorService.findByEmail(email);

        if (!inversor) throw new UnauthorizedException('Email o contraseña incorrectos.');

        const passwordValida = await bcrypt.compare(password, inversor.password);

        if (!passwordValida) throw new UnauthorizedException('Email o contraseña incorrectos.');

        const { password: _, ...result } = inversor;

        return result;
    }

    login(inversor: { id: number; rol: string }) {
        const payload = { id: inversor.id, rol: inversor.rol };
        return { accessToken: this.jwtService.sign(payload) };
    }
}