import { Test, TestingModule } from '@nestjs/testing';
import { FinnhubService } from './finnhub.service';
import { ConfigService } from '@nestjs/config';

jest.mock('finnhub', () => {
  function MockDefaultApi() {}
  
  MockDefaultApi.prototype.quote = function (ticker: string, callback: any) {
    if (typeof (global as any).mockFinnhubImplementation === 'function') {
      return (global as any).mockFinnhubImplementation(ticker, callback);
    }
    callback(null, { c: 150.5 });
  };

  return {
    DefaultApi: MockDefaultApi,
  };
});

describe('FinnhubService', () => {
  let service: FinnhubService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-api-key-123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinnhubService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    })
    .setLogger({ log: () => {}, error: () => {}, warn: () => {}, debug: () => {}, verbose: () => {} })
    .compile();

    service = module.get<FinnhubService>(FinnhubService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (global as any).mockFinnhubImplementation;
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
    expect(mockConfigService.get).toHaveBeenCalledWith('FINNHUB_API_KEY');
  });

  describe('obtenerPrecio', () => {
    it('debería resolver con el precio actual ("c") si la API responde de forma exitosa', async () => {
      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(null, { c: 185.75 });
      };

      const precio = await service.obtenerPrecio('AAPL');
      
      expect(precio).toBe(185.75);
    });

    it('debería rechazar con un error controlado si el SDK externo falla', async () => {
      const apiError = new Error('API Key Limit Exceeded');

      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(apiError, null);
      };

      await expect(service.obtenerPrecio('TSLA')).rejects.toThrow(
        'Error en llamada a Finnhub SDK: API Key Limit Exceeded'
      );
    });

    it('debería rechazar si la API responde pero el campo "c" es cero', async () => {
      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(null, { c: 0 });
      };

      await expect(service.obtenerPrecio('MSFT')).rejects.toThrow(
        "La API no retornó un precio válido ('c') para el ticker: MSFT"
      );
    });

    it('debería rechazar si la API responde pero el campo "c" viene indefinido', async () => {
      (global as any).mockFinnhubImplementation = (ticker: string, callback: any) => {
        callback(null, { c: undefined });
      };

      await expect(service.obtenerPrecio('GOOGL')).rejects.toThrow(
        "La API no retornó un precio válido ('c') para el ticker: GOOGL"
      );
    });
  });
});