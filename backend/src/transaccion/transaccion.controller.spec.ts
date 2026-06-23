import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionController } from './transaccion.controller';
import { TransaccionService } from './transaccion.service';
import { GetTransaccionesQueryDto } from './dto/input/get-transaccion-query.dto';
import type { Request } from 'express';

describe('TransaccionController', () => {
  let controller: TransaccionController;
  let service: TransaccionService;

  const mockTransaccionService = {
    findAll: jest.fn(),
    findHistorialTransacciones: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransaccionController],
      providers: [
        {
          provide: TransaccionService,
          useValue: mockTransaccionService,
        },
      ],
    }).compile();

    controller = module.get<TransaccionController>(TransaccionController);
    service = module.get<TransaccionService>(TransaccionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar todas las transacciones aplicando los filtros del query', async () => {
      const mockQuery: GetTransaccionesQueryDto = { limit: 10, page: 1 } as any;
      const mockResult = {
        data: [{ id: 1, tipoTransaccion: 'COMPRA', cantidad: 5 }],
        total: 1
      };
      
      mockTransaccionService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(mockQuery);

      expect(mockTransaccionService.findAll).toHaveBeenCalledWith(mockQuery);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findHistorial', () => {
    it('debería extraer el id del inversor de la request y pasar los filtros del query al service', async () => {
      const mockReq = {
        user: { id: 42 },
      } as any as Request;

      const mockQuery: GetTransaccionesQueryDto = { limit: 5 } as any;
      const mockHistorial = [{ id: 9, tipoTransaccion: 'VENTA', cantidad: 2 }];

      mockTransaccionService.findHistorialTransacciones.mockResolvedValue(mockHistorial);

      const result = await controller.findHistorial(mockQuery, mockReq);

      expect(mockTransaccionService.findHistorialTransacciones).toHaveBeenCalledWith(42, mockQuery);
      expect(result).toEqual(mockHistorial);
    });
  });
});