import { Test, TestingModule } from '@nestjs/testing';
import { TenenciaService } from './tenencia.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TenenciaActivo } from './tenenciaActivo.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Activo } from '@/activo/entities/activo.entity';
import { Portafolio } from '@/portafolio/portafolio.entity';

describe('TenenciaService', () => {
  let service: TenenciaService;
  let tenenciaRepo: Repository<TenenciaActivo>;

  const mockTenenciaRepo = {
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenenciaService,
        {
          provide: getRepositoryToken(TenenciaActivo),
          useValue: mockTenenciaRepo,
        },
      ],
    })
    .setLogger({ log: () => {}, error: () => {}, warn: () => {}, debug: () => {}, verbose: () => {} })
    .compile();

    service = module.get<TenenciaService>(TenenciaService);
    tenenciaRepo = module.get<Repository<TenenciaActivo>>(getRepositoryToken(TenenciaActivo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('verificarTenenciaCompra', () => {
    const activoMock = { id: 1, precioActual: 200 } as Activo;
    const portafolioMock = { id: 10, tenencias: [] } as unknown as Portafolio;

    it('debería crear y guardar una nueva tenencia si el activo no existía en el portafolio', async () => {
      const nuevaTenenciaSimulada = { id: 5, cantidad: 10, precioCompra: 200, activo: activoMock };
      mockTenenciaRepo.create.mockReturnValue(nuevaTenenciaSimulada);
      mockTenenciaRepo.save.mockResolvedValue(nuevaTenenciaSimulada);

      await service.verificarTenenciaCompra(portafolioMock, activoMock, 10);

      expect(mockTenenciaRepo.create).toHaveBeenCalledWith({
        cantidad: 10,
        precioCompra: 200,
        portafolio: portafolioMock,
        activo: activoMock,
      });
      expect(mockTenenciaRepo.save).toHaveBeenCalledWith(nuevaTenenciaSimulada);
    });

    it('debería actualizar la cantidad y recalcular el precio promedio ponderado (PPP) si ya existía', async () => {
      const tenenciaExistente = { 
        id: 5, 
        cantidad: 10, 
        precioCompra: 100, 
        activo: { id: 1 } 
      } as TenenciaActivo;
      
      const portafolioConTenencia = { tenencias: [tenenciaExistente] } as unknown as Portafolio;

      mockTenenciaRepo.save.mockResolvedValue(tenenciaExistente);

      await service.verificarTenenciaCompra(portafolioConTenencia, activoMock, 10);

      expect(tenenciaExistente.cantidad).toBe(20);
      expect(tenenciaExistente.precioCompra).toBe(150);
      expect(mockTenenciaRepo.save).toHaveBeenCalledWith(tenenciaExistente);
      expect(mockTenenciaRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('verificarTenenciaVenta', () => {
    const activoMock = { id: 1 } as Activo;

    it('debería restar la cantidad vendida y guardar la tenencia si le quedan acciones restantes', async () => {
      const tenenciaExistente = { id: 5, cantidad: 10, activo: { id: 1 } } as TenenciaActivo;
      const portafolioMock = { tenencias: [tenenciaExistente] } as unknown as Portafolio;

      mockTenenciaRepo.save.mockResolvedValue(tenenciaExistente);

      await service.verificarTenenciaVenta(portafolioMock, activoMock, 4);

      expect(tenenciaExistente.cantidad).toBe(6);
      expect(mockTenenciaRepo.save).toHaveBeenCalledWith(tenenciaExistente);
      expect(mockTenenciaRepo.remove).not.toHaveBeenCalled();
    });

    it('debería remover por completo la tenencia si la cantidad remanente llega a cero', async () => {
      const tenenciaExistente = { id: 5, cantidad: 5, activo: { id: 1 } } as TenenciaActivo;
      const portafolioMock = { tenencias: [tenenciaExistente] } as unknown as Portafolio;

      mockTenenciaRepo.remove.mockResolvedValue(tenenciaExistente);

      await service.verificarTenenciaVenta(portafolioMock, activoMock, 5);

      expect(tenenciaExistente.cantidad).toBe(0);
      expect(mockTenenciaRepo.remove).toHaveBeenCalledWith(tenenciaExistente);
      expect(mockTenenciaRepo.save).not.toHaveBeenCalled();
    });

    it('debería lanzar un BadRequestException si la cantidad a vender supera a la tenencia existente', async () => {
      const tenenciaInsuficiente = { id: 5, cantidad: 3, activo: { id: 1 } } as TenenciaActivo;
      const portafolioMock = { tenencias: [tenenciaInsuficiente] } as unknown as Portafolio;

      await expect(service.verificarTenenciaVenta(portafolioMock, activoMock, 5)).rejects.toThrow(
        BadRequestException
      );
      
      expect(mockTenenciaRepo.save).not.toHaveBeenCalled();
      expect(mockTenenciaRepo.remove).not.toHaveBeenCalled();
    });

    it('debería lanzar un BadRequestException si el activo ni siquiera figura en el portafolio', async () => {
      const portafolioVacio = { tenencias: [] } as unknown as Portafolio;

      await expect(service.verificarTenenciaVenta(portafolioVacio, activoMock, 1)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});