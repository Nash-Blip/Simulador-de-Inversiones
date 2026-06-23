import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { InversorService } from '@/inversor/inversor.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { CreateInversorDto } from '@/inversor/dto/input/create-inversor.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let inversorService: InversorService;
  let jwtService: JwtService;

  const mockInversorService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: InversorService, useValue: mockInversorService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    inversorService = module.get<InversorService>(InversorService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('debería registrar un inversor, firmar el payload y retornar el token junto al usuario', async () => {
      const dto: CreateInversorDto = { email: 'nuevo@test.com', nombre: 'Test', password: '123' };
      const mockInversorCreado = { id: 10, email: 'nuevo@test.com', rol: 'USER' };
      
      mockInversorService.create.mockResolvedValue(mockInversorCreado);
      mockJwtService.sign.mockReturnValue('mocked_access_token');

      const result = await service.register(dto);

      expect(mockInversorService.create).toHaveBeenCalledWith(dto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 10, rol: 'USER' });
      expect(result).toEqual({
        accessToken: 'mocked_access_token',
        inversor: mockInversorCreado,
      });
    });
  });

  describe('validateUser', () => {
    const email = 'user@test.com';
    const password = 'correct_password';
    const inversorMock = { id: 1, email, password: 'hashed_password_123', rol: 'USER', nombre: 'Juan' };

    it('debería retornar el inversor sin la contraseña si las credenciales son válidas', async () => {
      mockInversorService.findByEmail.mockResolvedValue(inversorMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(mockInversorService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, inversorMock.password);
      
      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({ id: 1, email, rol: 'USER', nombre: 'Juan' });
    });

    it('debería lanzar UnauthorizedException si el email no existe', async () => {
      mockInversorService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería lanzar UnauthorizedException si la contraseña no coincide', async () => {
      mockInversorService.findByEmail.mockResolvedValue(inversorMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser(email, 'wrong_password')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('debería generar un token de acceso basado en el id y rol del inversor', () => {
      const inversorPayload = { id: 7, rol: 'ADMIN' };
      mockJwtService.sign.mockReturnValue('token_desde_login');

      const result = service.login(inversorPayload);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: 7, rol: 'ADMIN' });
      expect(result).toEqual({ accessToken: 'token_desde_login' });
    });
  });
});