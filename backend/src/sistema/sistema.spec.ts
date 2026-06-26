import { Test, TestingModule } from '@nestjs/testing';
import { Sistema } from './sistema';
import { InversorService } from '@/inversor/inversor.service';
import { ActivoService } from '@/activo/activo.service';
import { TransaccionService } from '@/transaccion/transaccion.service';
import { TenenciaService } from '@/tenenciaActivo/tenencia.service';
import { TipoTransaccion } from '@/transaccion/transaccion.entity';
import { BadRequestException } from '@nestjs/common';

describe('Sistema', () => {
  let sistema: Sistema;
  let inversorService: InversorService;
  let activoService: ActivoService;
  let transaccionService: TransaccionService;
  let tenenciaService: TenenciaService;

  const mockInversorService = {
    findOne: jest.fn(),
    findPortafolio: jest.fn(),
    registrarCompra: jest.fn(),
    registrarVenta: jest.fn(),
  };
  const mockActivoService = {
    findOne: jest.fn(),
    actualizarActivo: jest.fn(),
  };
  const mockTransaccionService = {
    create: jest.fn(),
  };
  const mockTenenciaService = {
    verificarTenenciaCompra: jest.fn(),
    verificarTenenciaVenta: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Sistema,
        { provide: InversorService, useValue: mockInversorService },
        { provide: ActivoService, useValue: mockActivoService },
        { provide: TransaccionService, useValue: mockTransaccionService },
        { provide: TenenciaService, useValue: mockTenenciaService },
      ],
    }).compile();

    sistema = module.get<Sistema>(Sistema);
    inversorService = module.get<InversorService>(InversorService);
    activoService = module.get<ActivoService>(ActivoService);
    transaccionService = module.get<TransaccionService>(TransaccionService);
    tenenciaService = module.get<TenenciaService>(TenenciaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(sistema).toBeDefined();
  });

  describe('procesarCompra', () => {
    const compraDto = { activoId: 1, cantidad: 10 };
    const inversorMock = { id: 42, saldoVirtual: 5000 };
    const activoMock = { id: 1, precioActual: 200 }; 
    const portafolioMock = { tenencias: [] };
    const transaccionMock = { 
      cantidad: 10, 
      fecha: new Date(), 
      precioEjecutado: 200, 
      tipoTransaccion: TipoTransaccion.COMPRA 
    };

    it('debería procesar la compra exitosamente si el inversor tiene saldo', async () => {
      mockInversorService.findOne.mockResolvedValue(inversorMock);
      mockActivoService.findOne.mockResolvedValue(activoMock);
      mockInversorService.findPortafolio.mockResolvedValue(portafolioMock);
      mockTransaccionService.create.mockResolvedValue(transaccionMock);
      mockTenenciaService.verificarTenenciaCompra.mockResolvedValue(undefined);
      mockInversorService.registrarCompra.mockResolvedValue(undefined);

      const result = await sistema.procesarCompra(compraDto, 42);

      expect(mockTenenciaService.verificarTenenciaCompra).toHaveBeenCalledWith(portafolioMock, activoMock, 10);
      expect(mockTransaccionService.create).toHaveBeenCalledWith(TipoTransaccion.COMPRA, 10, 2000, portafolioMock, activoMock);
      expect(mockActivoService.actualizarActivo).toHaveBeenCalledWith(activoMock, 10, TipoTransaccion.COMPRA);
      expect(mockInversorService.registrarCompra).toHaveBeenCalledWith(42, 2000);
      
      expect(result.cantidad).toBe(10);
      expect(result.TipoTransaccion).toBe(TipoTransaccion.COMPRA);
    });

    it('debería lanzar BadRequestException si el saldo es insuficiente', async () => {
      const inversorPobre = { ...inversorMock, saldoVirtual: 500 }; 
      mockInversorService.findOne.mockResolvedValue(inversorPobre);
      mockActivoService.findOne.mockResolvedValue(activoMock);

      await expect(sistema.procesarCompra(compraDto, 42)).rejects.toThrow(BadRequestException);
      
      expect(mockTenenciaService.verificarTenenciaCompra).not.toHaveBeenCalled();
      expect(mockTransaccionService.create).not.toHaveBeenCalled();
    });
  });

  describe('procesarVenta', () => {
    const ventaDto = { activoId: 1, cantidad: 5 };
    const activoMock = { id: 1, precioActual: 300 };
    const portafolioMock = {
      tenencias: [{ activo: { id: 1 }, precioCompra: 200, cantidad: 10 }] 
    };
    const transaccionMock = { 
      cantidad: 5, 
      fecha: new Date(), 
      precioEjecutado: 300, 
      tipoTransaccion: TipoTransaccion.VENTA 
    };

    it('debería procesar la venta exitosamente si posee las tenencias', async () => {
      mockActivoService.findOne.mockResolvedValue(activoMock);
      mockInversorService.findPortafolio.mockResolvedValue(portafolioMock);
      mockTenenciaService.verificarTenenciaVenta.mockResolvedValue(undefined);
      mockTransaccionService.create.mockResolvedValue(transaccionMock);
      mockInversorService.registrarVenta.mockResolvedValue(undefined);

      const result = await sistema.procesarVenta(ventaDto, 42);

      expect(mockTenenciaService.verificarTenenciaVenta).toHaveBeenCalledWith(portafolioMock, activoMock, 5);
      expect(mockTransaccionService.create).toHaveBeenCalledWith(TipoTransaccion.VENTA, 5, 1500, portafolioMock, activoMock);
      expect(mockActivoService.actualizarActivo).toHaveBeenCalledWith(activoMock, 5, TipoTransaccion.VENTA);
      expect(mockInversorService.registrarVenta).toHaveBeenCalledWith(42, 1500, 1000);
      
      expect(result.cantidad).toBe(5);
      expect(result.TipoTransaccion).toBe(TipoTransaccion.VENTA);
    });

    it('debería propagar el error si verificarTenenciaVenta falla', async () => {
      mockActivoService.findOne.mockResolvedValue(activoMock);
      mockInversorService.findPortafolio.mockResolvedValue(portafolioMock);
      
      mockTenenciaService.verificarTenenciaVenta.mockRejectedValue(new BadRequestException('No posee el activo o la cantidad suficiente'));

      await expect(sistema.procesarVenta(ventaDto, 42)).rejects.toThrow(BadRequestException);
      
      expect(mockTransaccionService.create).not.toHaveBeenCalled();
      expect(mockInversorService.registrarVenta).not.toHaveBeenCalled();
    });
  });
});