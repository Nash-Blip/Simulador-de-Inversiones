import { Test, TestingModule } from '@nestjs/testing';
import { FinnhubService } from './finnhub.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activo } from '@/activo/entities/activo.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

jest.mock('finnhub', () => {
  function MockDefaultApi() {}
  
  MockDefaultApi.prototype.quote = function (ticker: string, callback: any) {
    if (typeof (global as any).mockFinnhubImplementation === 'function') {
      return (global as any).mockFinnhubImplementation(ticker, callback);
    }
    callback(null, { c: 150.5 }, null);
  };

  return {
    DefaultApi: MockDefaultApi,
  };
});

describe('FinnhubService', () => {
  let service: FinnhubService;
  let activoRepo: Repository<Activo>;

  const mockActivoRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinnhubService,
        {
          provide: getRepositoryToken(Activo),
          useValue: mockActivoRepo,
        },
      ],
    })
    // muteamos los loggers
    .setLogger({ log: () => {}, error: () => {}, warn: () => {}, debug: () => {}, verbose: () => {} })
    .compile();

    service = module.get<FinnhubService>(FinnhubService);
    activoRepo = module.get<Repository<Activo>>(getRepositoryToken(Activo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('obtenerPrecioInicial', () => {
    afterEach(() => {
      delete (global as any).mockFinnhubImplementation;
    });

    it('debería resolver con el precio actual ("c") si la API de Finnhub responde exitosamente', async () => {
      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(null, { c: 150.5 }, null);
      };

      const precio = await (service as any).obtenerPrecioInicial('AAPL');
      expect(precio).toBe(150.5);
    });

    it('debería rechazar con un error si la API externa falla', async () => {
      const apiError = new Error('API Key Limit Exceeded');

      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(apiError, null, null);
      };

      await expect((service as any).obtenerPrecioInicial('TSLA')).rejects.toThrow(
        'Error en llamada a Finnhub SDK: API Key Limit Exceeded'
      );
    });

    it('debería rechazar si la API responde pero el campo "c" es 0 o indefinido', async () => {
      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(null, { c: 0 }, null);
      };

      await expect((service as any).obtenerPrecioInicial('MSFT')).rejects.toThrow(
        "La API no retornó un precio válido ('c') para el ticker: MSFT"
      );
    });
  });

  describe('updateActivo', () => {
    it('debería actualizar todas las variables de precio y guardar el activo', async () => {
      const mockActivoBase = { ticker: 'AAPL', precioInicial: 0, precioActual: 0, valorMaximo: 0, valorMinimo: 0 };
      mockActivoRepo.findOne.mockResolvedValue(mockActivoBase);

      await (service as any).updateActivo('AAPL', 200);

      expect(mockActivoRepo.findOne).toHaveBeenCalledWith({ where: { ticker: 'AAPL' } });
      expect(mockActivoRepo.save).toHaveBeenCalledWith({
        ticker: 'AAPL',
        precioInicial: 200,
        precioActual: 200,
        valorMaximo: 200,
        valorMinimo: 200,
      });
    });

    it('debería lanzar NotFoundException si el ticker no existe en la base de datos', async () => {
      mockActivoRepo.findOne.mockResolvedValue(null);

      await expect((service as any).updateActivo('INVENTADO', 100)).rejects.toThrow(NotFoundException);
      expect(mockActivoRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('onApplicationBootstrap', () => {
    it('debería sincronizar todos los tickers de la base de datos exitosamente', async () => {
      const activosEnBD = [{ ticker: 'AAPL' }, { ticker: 'GOOGL' }];
      mockActivoRepo.find.mockResolvedValue(activosEnBD);

      const obtenerPrecioSpy = jest.spyOn(service as any, 'obtenerPrecioInicial').mockResolvedValue(150);
      const updateActivoSpy = jest.spyOn(service as any, 'updateActivo').mockResolvedValue(undefined);

      await service.onApplicationBootstrap();

      expect(mockActivoRepo.find).toHaveBeenCalled();
      expect(obtenerPrecioSpy).toHaveBeenCalledTimes(2);
      expect(updateActivoSpy).toHaveBeenCalledTimes(2);
    });

    it('debería continuar sincronizando los demás activos si uno en particular falla', async () => {
      const activosEnBD = [{ ticker: 'FALLA' }, { ticker: 'EXITO' }];
      mockActivoRepo.find.mockResolvedValue(activosEnBD);

      const obtenerPrecioSpy = jest.spyOn(service as any, 'obtenerPrecioInicial');
      obtenerPrecioSpy.mockRejectedValueOnce(new Error('Error de red'));
      obtenerPrecioSpy.mockResolvedValueOnce(300);

      const updateActivoSpy = jest.spyOn(service as any, 'updateActivo').mockResolvedValue(undefined);

      await service.onApplicationBootstrap();

      expect(obtenerPrecioSpy).toHaveBeenCalledTimes(2);
      expect(updateActivoSpy).toHaveBeenCalledTimes(1);
      expect(updateActivoSpy).toHaveBeenCalledWith('EXITO', 300);
    });
  });
});