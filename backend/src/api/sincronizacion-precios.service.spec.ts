import { Test, TestingModule } from '@nestjs/testing';
import { SincronizacionPreciosService } from './sincronizacion-precios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Activo } from '@/activo/entities/activo.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PrecioConexion } from './conexion/precio-conexion.interface';

describe('SincronizacionPreciosService', () => {
  let service: SincronizacionPreciosService;
  let activoRepo: Repository<Activo>;
  let precioConexion: PrecioConexion;

  const mockActivoRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockPrecioConexion = {
    obtenerPrecio: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SincronizacionPreciosService,
        {
          provide: getRepositoryToken(Activo),
          useValue: mockActivoRepo,
        },
        {
          provide: PrecioConexion,
          useValue: mockPrecioConexion,
        },
      ],
    })
    .setLogger({ log: () => {}, error: () => {}, warn: () => {}, debug: () => {}, verbose: () => {} })
    .compile();

    service = module.get<SincronizacionPreciosService>(SincronizacionPreciosService);
    activoRepo = module.get<Repository<Activo>>(getRepositoryToken(Activo));
    precioConexion = module.get<PrecioConexion>(PrecioConexion);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
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
      
      mockPrecioConexion.obtenerPrecio.mockResolvedValue(150);

      const updateActivoSpy = jest.spyOn(service as any, 'updateActivo').mockResolvedValue(undefined);

      await service.onApplicationBootstrap();

      expect(mockActivoRepo.find).toHaveBeenCalled();
      expect(mockPrecioConexion.obtenerPrecio).toHaveBeenCalledTimes(2);
      expect(mockPrecioConexion.obtenerPrecio).toHaveBeenNthCalledWith(1, 'AAPL');
      expect(mockPrecioConexion.obtenerPrecio).toHaveBeenNthCalledWith(2, 'GOOGL');
      expect(updateActivoSpy).toHaveBeenCalledTimes(2);
    });

    it('debería continuar sincronizando los demás activos si uno en particular falla', async () => {
      const activosEnBD = [{ ticker: 'FALLA' }, { ticker: 'EXITO' }];
      mockActivoRepo.find.mockResolvedValue(activosEnBD);

      mockPrecioConexion.obtenerPrecio.mockRejectedValueOnce(new Error('Proveedor Caído'));
      mockPrecioConexion.obtenerPrecio.mockResolvedValueOnce(300);

      const updateActivoSpy = jest.spyOn(service as any, 'updateActivo').mockResolvedValue(undefined);

      await service.onApplicationBootstrap();

      expect(mockPrecioConexion.obtenerPrecio).toHaveBeenCalledTimes(2);
      expect(updateActivoSpy).toHaveBeenCalledTimes(1);
      expect(updateActivoSpy).toHaveBeenCalledWith('EXITO', 300);
    });
  });
});