import { Test, TestingModule } from '@nestjs/testing';
import { SimuladorService } from './simulador';
import { ActivoService } from '../activo/activo.service';
import { TransaccionService } from '@/transaccion/transaccion.service';
import { Activo } from '../activo/entities/activo.entity';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { Logger } from '@nestjs/common';

describe('Simulador', () => {
  let service: SimuladorService;
  let transaccionService: TransaccionService;
  let activoService: ActivoService;

  const mockTransaccionService = {
    create: jest.fn(),
  };

  const mockActivoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    actualizarActivo: jest.fn(),
  };

  beforeEach(async () => {
    // Silenciamos los logs durante las pruebas
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => null);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimuladorService,
        { provide: TransaccionService, useValue: mockTransaccionService },
        { provide: ActivoService, useValue: mockActivoService },
      ],
    }).compile();

    service = module.get<SimuladorService>(SimuladorService);
    transaccionService = module.get<TransaccionService>(TransaccionService);
    activoService = module.get<ActivoService>(ActivoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('debería cargar el catálogo inicial mediante ActivoService si está vacío', async () => {
      mockActivoService.findAll.mockResolvedValue([]);
      mockActivoService.create.mockResolvedValue({} as any);

      await service.onApplicationBootstrap();

      expect(mockActivoService.findAll).toHaveBeenCalled();
      expect(mockActivoService.create).toHaveBeenCalledTimes(5);
    });

    it('no debería crear activos si .findAll() ya trae registros', async () => {
      mockActivoService.findAll.mockResolvedValue([{ id: 1, nombre: 'Apple Inc.' }]);

      await service.onApplicationBootstrap();

      expect(mockActivoService.findAll).toHaveBeenCalled();
      expect(mockActivoService.create).not.toHaveBeenCalled();
    });
  });

  describe('simularMercado', () => {
    const mockActivos: Activo[] = [
      { id: 1, nombre: 'Apple Inc.', ticker: 'AAPL', precioActual: 150 } as Activo
    ];

    it('debería terminar el ciclo pacíficamente si no hay activos disponibles en el servicio', async () => {
      mockActivoService.findAll.mockResolvedValue([]);
      
      await service.simularMercado();

      expect(mockTransaccionService.create).not.toHaveBeenCalled();
    });

    it('debería ejecutar una transacción y actualizar el activo correctamente a través del servicio', async () => {
      mockActivoService.findAll.mockResolvedValue(mockActivos);
      mockTransaccionService.create.mockResolvedValue({} as any);
      mockActivoService.actualizarActivo.mockResolvedValue(155);

      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      await service.simularMercado();

      expect(mockActivoService.findAll).toHaveBeenCalled();
      expect(mockTransaccionService.create).toHaveBeenCalled();
      expect(mockActivoService.actualizarActivo).toHaveBeenCalledWith(
        mockActivos[0],
        expect.any(Number),
        expect.any(String)
      );
    });

    it('debería capturar y loguear los errores si el ciclo falla', async () => {
      mockActivoService.findAll.mockRejectedValue(new Error('Fatal Error'));
      const loggerSpy = jest.spyOn(Logger.prototype, 'error');

      await service.simularMercado();

      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe('Lógica de Decisiones Basada en Tendencias', () => {
    it('debería acumular historial mediante llamadas sucesivas y reaccionar al FOMO (Compra)', async () => {
      const activoUnico = { id: 3, precioActual: 100 } as Activo;
      mockActivoService.findAll.mockResolvedValue([activoUnico]);
      mockTransaccionService.create.mockResolvedValue({} as any);
      
      // Primer ciclo: Registra precio base de 100
      await service.simularMercado();

      // Forzamos que el precio suba a 300 para el próximo ciclo
      activoUnico.precioActual = 300;
      
      // Fijamos Math.random en 0.5. Con tendencia positiva 
      jest.spyOn(Math, 'random').mockReturnValue(0.5);

      await service.simularMercado();

      expect(mockTransaccionService.create).toHaveBeenLastCalledWith(
        TipoTransaccion.COMPRA,
        expect.any(Number),
        expect.any(Number),
        null,
        expect.anything()
      );
    });
  });
});