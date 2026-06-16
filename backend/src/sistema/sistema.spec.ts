import { Test, TestingModule } from '@nestjs/testing';
import { Sistema } from './sistema';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inversor } from '@/inversor/entities/inversor.entity';
import { TenenciaActivo } from '@/tenenciaActivo/tenenciaActivo.entity';
import { InversorService } from '@/inversor/inversor.service';
import { ActivoService } from '@/activo/activo.service';
import { TransaccionService } from '@/transaccion/transaccion.service';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('Sistema', () => {
  let sistema: Sistema;
  let inversorRepo: Repository<Inversor>;
  let tenenciaRepo: Repository<TenenciaActivo>;
  let inversorService: InversorService;
  let activoService: ActivoService;
  let transaccionService: TransaccionService;

  const mockInversorRepo = { save: jest.fn() };
  const mockTenenciaRepo = { save: jest.fn(), create: jest.fn(), remove: jest.fn() };

  const mockInversorService = { findOne: jest.fn(), findPortafolio: jest.fn() };
  const mockActivoService = { findOne: jest.fn(), actualizarActivo: jest.fn() };
  const mockTransaccionService = { create: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Sistema,
        { provide: getRepositoryToken(Inversor), useValue: mockInversorRepo },
        { provide: getRepositoryToken(TenenciaActivo), useValue: mockTenenciaRepo },
        { provide: InversorService, useValue: mockInversorService },
        { provide: ActivoService, useValue: mockActivoService },
        { provide: TransaccionService, useValue: mockTransaccionService },
      ],
    }).compile();

    sistema = module.get<Sistema>(Sistema);
    inversorRepo = module.get<Repository<Inversor>>(getRepositoryToken(Inversor));
    tenenciaRepo = module.get<Repository<TenenciaActivo>>(getRepositoryToken(TenenciaActivo));
    inversorService = module.get<InversorService>(InversorService);
    activoService = module.get<ActivoService>(ActivoService);
    transaccionService = module.get<TransaccionService>(TransaccionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(sistema).toBeDefined();
  });

  describe('procesarCompra', () => {
    const compraDto = { activoId: 1, cantidad: 10 };
    const inversorMock = { id: 42, saldoVirtual: 5000, portafolio: { costoPortafolio: 1000 } };
    const activoMock = { id: 1, precioActual: 200 }; 
    const portafolioMock = { tenencias: [] };
    const transaccionMock = { cantidad: 10, fecha: new Date(), precioExecuted: 2000, tipoTransaccion: TipoTransaccion.COMPRA };

    it('debería procesar la compra exitosamente si el inversor tiene saldo', async () => {
      mockInversorService.findOne.mockResolvedValue(inversorMock);
      mockActivoService.findOne.mockResolvedValue(activoMock);
      mockInversorService.findPortafolio.mockResolvedValue(portafolioMock);
      mockTransaccionService.create.mockResolvedValue(transaccionMock);
      
      const verificarCompraSpy = jest.spyOn(sistema, 'verificarTenenciaCompra').mockResolvedValue(undefined);

      const result = await sistema.procesarCompra(compraDto, 42);

      expect(inversorMock.saldoVirtual).toBe(3000);
      expect(inversorMock.portafolio.costoPortafolio).toBe(3000);
      expect(mockActivoService.actualizarActivo).toHaveBeenCalledWith(activoMock, 10, TipoTransaccion.COMPRA);
      expect(mockInversorRepo.save).toHaveBeenCalledWith(inversorMock);
      expect(result.cantidad).toBe(10);
      
      verificarCompraSpy.mockRestore();
    });

    it('debería lanzar BadRequestException si el saldo es insuficiente', async () => {
      const inversorPobre = { ...inversorMock, saldoVirtual: 500 };
      mockInversorService.findOne.mockResolvedValue(inversorPobre);
      mockActivoService.findOne.mockResolvedValue(activoMock);

      await expect(sistema.procesarCompra(compraDto, 42)).rejects.toThrow(BadRequestException);
      expect(mockInversorRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('procesarVenta', () => {
    const ventaDto = { activoId: 1, cantidad: 5 };
    const inversorMock = { id: 42, saldoVirtual: 1000, portafolio: { costoPortafolio: 2000 } };
    const activoMock = { id: 1, precioActual: 300 };
    const portafolioMock = {
      tenencias: [{ activo: { id: 1 }, precioCompra: 200, cantidad: 10 }] 
    };
    const transaccionMock = { cantidad: 5, fecha: new Date(), precioEjecutado: 1500, tipoTransaccion: TipoTransaccion.VENTA };

    it('debería procesar la venta exitosamente si posee las tenencias', async () => {
      mockInversorService.findOne.mockResolvedValue(inversorMock);
      mockActivoService.findOne.mockResolvedValue(activoMock);
      mockInversorService.findPortafolio.mockResolvedValue(portafolioMock);
      mockTransaccionService.create.mockResolvedValue(transaccionMock);

      const verificarVentaSpy = jest.spyOn(sistema, 'verificarTenenciaVenta').mockResolvedValue(undefined!);

      const result = await sistema.procesarVenta(ventaDto, 42);

      expect(inversorMock.saldoVirtual).toBe(2500);
      expect(inversorMock.portafolio.costoPortafolio).toBe(1000);
      expect(mockInversorRepo.save).toHaveBeenCalled();
      expect(result.cantidad).toBe(5);

      verificarVentaSpy.mockRestore();
    });

    it('debería lanzar BadRequestException si el inversor no posee el activo en su portafolio', async () => {
      mockInversorService.findOne.mockResolvedValue(inversorMock);
      mockActivoService.findOne.mockResolvedValue(activoMock);
      mockInversorService.findPortafolio.mockResolvedValue({ tenencias: [] });

      await expect(sistema.procesarVenta(ventaDto, 42)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verificarTenenciaCompra', () => {
    const activo = { id: 1, precioActual: 200 } as any;

    it('debería crear una nueva tenencia si el activo no existía en el portafolio', async () => {
      const portafolio = { tenencias: [] } as any;
      mockTenenciaRepo.create.mockReturnValue({ id: 99 });

      await sistema.verificarTenenciaCompra(portafolio, activo, 10);

      expect(mockTenenciaRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        cantidad: 10,
        precioCompra: 200,
        activo
      }));
      expect(mockTenenciaRepo.save).toHaveBeenCalled();
    });

    it('debería recalcular el precio promedio ponderado si el activo ya existía', async () => {
      const tenenciaExistente = { activo: { id: 1 }, cantidad: 10, precioCompra: 100 };
      const portafolio = { tenencias: [tenenciaExistente] } as any;

      // Compra nueva: 10 acciones a $200
      // Promedio = ((10 * 100) + (10 * 200)) / (10 + 10) = (1000 + 2000) / 20 = 150
      await sistema.verificarTenenciaCompra(portafolio, activo, 10);

      expect(tenenciaExistente.cantidad).toBe(20);
      expect(tenenciaExistente.precioCompra).toBe(150);
      expect(mockTenenciaRepo.save).toHaveBeenCalledWith(tenenciaExistente);
    });
  });

  describe('verificarTenenciaVenta', () => {
    const activo = { id: 1 } as any;
    
    it('debería restar la cantidad vendida de la tenencia existente', async () => {
      const tenenciaExistente = { activo: { id: 1 }, cantidad: 10 };
      const portafolio = { tenencias: [tenenciaExistente] } as any;

      await sistema.verificarTenenciaVenta(portafolio, activo, 4);

      expect(tenenciaExistente.cantidad).toBe(6);
      expect(mockTenenciaRepo.save).toHaveBeenCalledWith(tenenciaExistente);
      expect(mockTenenciaRepo.remove).not.toHaveBeenCalled();
    });

    it('debería remover por completo la tenencia de la BD si la cantidad llega a 0', async () => {
      const tenenciaExistente = { activo: { id: 1 }, cantidad: 5 };
      const portafolio = { tenencias: [tenenciaExistente] } as any;

      await sistema.verificarTenenciaVenta(portafolio, activo, 5);

      expect(tenenciaExistente.cantidad).toBe(0);
      expect(mockTenenciaRepo.remove).toHaveBeenCalledWith(tenenciaExistente);
    });

    it('debería lanzar BadRequestException si intenta vender más de lo que tiene', async () => {
      const tenenciaExistente = { activo: { id: 1 }, cantidad: 2 };
      const portafolio = { tenencias: [tenenciaExistente] } as any;

      await expect(sistema.verificarTenenciaVenta(portafolio, activo, 5)).rejects.toThrow(BadRequestException);
    });
  });
});