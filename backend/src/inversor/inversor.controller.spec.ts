import { Test, TestingModule } from '@nestjs/testing';
import { InversorController } from './inversor.controller';
import { InversorService } from './inversor.service';
import { CreateInversorDto } from './dto/create-inversor.dto';
import { CambioPasswordDto } from './dto/cambio-password.dto';
import type { Request } from 'express';

describe('InversorController', () => {
  let controller: InversorController;
  let service: InversorService;

  const mockInversorService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findPortafolio: jest.fn(),
    findPerfil: jest.fn(),
    cambiarPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InversorController],
      providers: [
        {
          provide: InversorService,
          useValue: mockInversorService,
        },
      ],
    }).compile();

    controller = module.get<InversorController>(InversorController);
    service = module.get<InversorService>(InversorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('Rutas de Admin', () => {

    it('findAll() debería retornar todos los inversores', async () => {
      const mockInversores = [{ id: 1, nombre: 'Inversor 1' }, { id: 2, nombre: 'Inversor 2' }];
      mockInversorService.findAll.mockResolvedValue(mockInversores);

      const result = await controller.findAll();

      expect(mockInversorService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockInversores);
    });

    it('findOne() debería buscar un inversor por su ID', async () => {
      const mockInversor = { id: 5, nombre: 'Juan' };
      mockInversorService.findOne.mockResolvedValue(mockInversor);

      const result = await controller.findOne(5);

      expect(mockInversorService.findOne).toHaveBeenCalledWith(5);
      expect(result).toEqual(mockInversor);
    });

    it('findPortafolio() debería buscar el portafolio de cualquier id provisto', async () => {
      const mockPortafolio = { valorPortafolio: 15000 };
      mockInversorService.findPortafolio.mockResolvedValue(mockPortafolio);

      const result = await controller.findPortafolio(10);

      expect(mockInversorService.findPortafolio).toHaveBeenCalledWith(10);
      expect(result).toEqual(mockPortafolio);
    });
  });

  describe('Rutas del Inversor', () => {
    let mockReq: Request;

    beforeEach(() => {
      mockReq = {
        user: { id: 42 },
      } as any as Request;
    });

    it('findMyPortafolio() debería retornar el portafolio del usuario logueado', async () => {
      const mockPortafolio = { valorPortafolio: 5000 };
      mockInversorService.findPortafolio.mockResolvedValue(mockPortafolio);

      const result = await controller.findMyPortafolio(mockReq);

      expect(mockInversorService.findPortafolio).toHaveBeenCalledWith(42);
      expect(result).toEqual(mockPortafolio);
    });

    it('findPerfil() debería retornar los datos de perfil del usuario logueado', async () => {
      const mockPerfil = { nombre: 'Matias', email: 'matias@test.com' };
      mockInversorService.findPerfil.mockResolvedValue(mockPerfil);

      const result = await controller.findPerfil(mockReq);

      expect(mockInversorService.findPerfil).toHaveBeenCalledWith(42);
      expect(result).toEqual(mockPerfil);
    });

    it('cambiarPassword() debería pasar el id del usuario de la req y el dto al servicio', async () => {
      const dto: CambioPasswordDto = { passwordActual: '123', passwordNueva: '456' };
      const mockResponse = { message: 'Contraseña actualizada con éxito.' };
      mockInversorService.cambiarPassword.mockResolvedValue(mockResponse);

      const result = await controller.cambiarPassword(mockReq, dto);

      expect(mockInversorService.cambiarPassword).toHaveBeenCalledWith(42, dto);
      expect(result).toEqual(mockResponse);
    });
  });
});
