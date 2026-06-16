import { Test, TestingModule } from '@nestjs/testing';
import { ActivoController } from './activo.controller';
import { ActivoService } from './activo.service';
import { Sistema } from '@/sistema/sistema';
import { CreateActivoDto } from './dto/create-activo.dto';
import { CompraActivoDto } from './dto/compra-activo.dto';
import { VentaActivoDto } from './dto/venta-activo.dto';
import type { Request } from 'express';

describe('ActivoController', () => {
  let controller: ActivoController;
  let service: ActivoService;
  let sistema: Sistema;

  const mockActivoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  const mockSistema = {
    procesarCompra: jest.fn(),
    procesarVenta: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivoController],
      providers: [
        {
          provide: ActivoService,
          useValue: mockActivoService,
        },
        {
          provide: Sistema,
          useValue: mockSistema,
        },
      ],
    }).compile();

    controller = module.get<ActivoController>(ActivoController);
    service = module.get<ActivoService>(ActivoService);
    sistema = module.get<Sistema>(Sistema);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debería llamar a ActivoService.create y retornar el resultado', async () => {
      const dto: CreateActivoDto = { nombre: 'Ethereum', ticker: 'ETH', precioInicial: 3000 };
      const expectedResult = { id: 1, ...dto };
      mockActivoService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(mockActivoService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('comprar', () => {
    it('debería llamar a Sistema.procesarCompra usando el ID del usuario del Request', async () => {
      const dto: CompraActivoDto = { activoId: 1, cantidad: 10 };
      const expectedResult = { mensaje: 'Compra procesada con éxito' };
      
      const mockRequest = {
        user: { id: 42 },
      } as any as Request;

      mockSistema.procesarCompra.mockResolvedValue(expectedResult);

      const result = await controller.comprar(dto, mockRequest);

      expect(mockSistema.procesarCompra).toHaveBeenCalledWith(dto, 42);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('vender', () => {
    it('debería llamar a Sistema.procesarVenta usando el ID del usuario del Request', async () => {
      const dto: VentaActivoDto = { activoId: 1, cantidad: 5 };
      const expectedResult = { mensaje: 'Venta procesada con éxito' };
      
      const mockRequest = {
        user: { id: 42 },
      } as any as Request;

      mockSistema.procesarVenta.mockResolvedValue(expectedResult);

      const result = await controller.vender(dto, mockRequest);

      expect(mockSistema.procesarVenta).toHaveBeenCalledWith(dto, 42);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('debería retornar la lista de activos provista por el servicio', async () => {
      const expectedResult = [{ id: 1, nombre: 'Bitcoin' }];
      mockActivoService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockActivoService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('debería retornar un activo específico llamando al servicio con el id', async () => {
      const id = 1;
      const expectedResult = { id, nombre: 'Bitcoin' };
      mockActivoService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(mockActivoService.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });
  });
});
