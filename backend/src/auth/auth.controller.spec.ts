import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateInversorDto } from '@/inversor/dto/input/create-inversor.dto';
import type { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as any as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debería registrar al inversor, guardar la cookie del token y retornar el éxito', async () => {
      const dto: CreateInversorDto = { email: 'juan@test.com', nombre: 'Juan', password: 'password123' };
      const mockServiceResponse = {
        accessToken: 'mock_jwt_token',
        inversor: { id: 1, email: 'juan@test.com', nombre: 'Juan' },
      };

      mockAuthService.register.mockResolvedValue(mockServiceResponse);

      const result = await controller.register(dto, mockResponse);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(mockResponse.cookie).toHaveBeenCalledWith('token', 'mock_jwt_token', expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
      }));
      expect(result).toEqual({
        message: 'Registro exitoso',
        inversor: mockServiceResponse.inversor,
      });
    });
  });

  describe('login', () => {
    it('debería validar al usuario, generar el token, setear la cookie y retornar el éxito', async () => {
      const body = { email: 'juan@test.com', password: 'password123' };
      const mockInversor = { id: 1, email: 'juan@test.com', nombre: 'Juan' };
      
      mockAuthService.validateUser.mockResolvedValue(mockInversor);
      mockAuthService.login.mockReturnValue({ accessToken: 'login_jwt_token' });

      const result = await controller.login(body, mockResponse);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(body.email, body.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(mockInversor);
      expect(mockResponse.cookie).toHaveBeenCalledWith('token', 'login_jwt_token', expect.any(Object));
      expect(result).toEqual({
        message: 'Login exitoso',
        inversor: mockInversor,
      });
    });
  });

  describe('logout', () => {
    it('debería limpiar la cookie del token y confirmar el cierre de sesión', () => {
      const result = controller.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('token', expect.objectContaining({
        httpOnly: true,
        sameSite: 'strict',
      }));
      expect(result).toEqual({
        message: 'Sesión cerrada exitosamente',
      });
    });
  });
});