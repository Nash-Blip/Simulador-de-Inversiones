import { Test, TestingModule } from '@nestjs/testing';
import { InversorService } from './inversor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inversor } from './entities/inversor.entity';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('InversorService', () => {
  let service: InversorService;
  let repository: Repository<Inversor>;

  const mockInversorRepository = {
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockInversorConPortafolio = {
    id: 1,
    saldoVirtual: 10000,
    portafolio: {
      id: 10,
      costoPortafolio: 400,
      tenencias: [
        {
          id: 101,
          cantidad: 2,
          precioCompra: 200,
          activo: { id: 5, nombre: 'Apple Inc.', precioActual: 250 }
        }
      ],
      transacciones: []
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InversorService,
        {
          provide: getRepositoryToken(Inversor),
          useValue: mockInversorRepository,
        },
      ],
    }).compile();

    service = module.get<InversorService>(InversorService);
    repository = module.get<Repository<Inversor>>(getRepositoryToken(Inversor));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('create', () => {
    const dto = { email: 'test@test.com', nombre: 'Test', password: '123' };

    it('debería crear un nuevo inversor exitosamente', async () => {
      mockInversorRepository.findOneBy.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_123');
      mockInversorRepository.create.mockReturnValue({ ...dto, password: 'hashed_123' });

      await service.create(dto);

      expect(mockInversorRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: dto.email,
        saldoVirtual: 10000
      }));
      expect(mockInversorRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si el email ya existe', async () => {
      mockInversorRepository.findOneBy.mockResolvedValue({ id: 1 });
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findPortafolio', () => {
    it('debería retornar el portafolio con sus relaciones, rendimientos y saldos', async () => {
      mockInversorRepository.findOne.mockResolvedValue(mockInversorConPortafolio);
      // Spies para controlar la respuesta de los math.random
      jest.spyOn(service as any, 'calcularRendimientoTenencia').mockReturnValue(25);
      jest.spyOn(service as any, 'calcularValorPortafolio').mockReturnValue(500);
      jest.spyOn(service as any, 'calcularRendimientoPortafolio').mockReturnValue(25);

      const result = await service.findPortafolio(1);

      expect(mockInversorRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 1 },
        relations: expect.any(Object)
      }));

      expect(result).toEqual({
        saldoVirtual: 10000,
        id: 10,
        costoPortafolio: 400,
        valorPortafolio: 500,
        rendimientoPortafolio: 25,
        transacciones: [],
        tenencias: [
          {
            id: 101,
            cantidad: 2,
            precioCompra: 200,
            activo: { id: 5, nombre: 'Apple Inc.', precioActual: 250 },
            rendimiento: 25
          }
        ]
      });
    });

    it('debería lanzar NotFoundException si no existe el portafolio', async () => {
      mockInversorRepository.findOne.mockResolvedValue(null);
      await expect(service.findPortafolio(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('cambiarPassword', () => {
    const cambioDto = { passwordActual: 'vieja', passwordNueva: 'nueva' };
    const inversorSimulado = { id: 1, password: 'hash_viejo' };

    it('debería actualizar la contraseña si la actual es correcta', async () => {
      mockInversorRepository.findOneBy.mockResolvedValue(inversorSimulado);
      
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hash_nuevo');

      const result = await service.cambiarPassword(1, cambioDto);

      expect(result.message).toContain('éxito');
      expect(mockInversorRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar ConflictException si la contraseña actual no coincide', async () => {
      mockInversorRepository.findOneBy.mockResolvedValue(inversorSimulado);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.cambiarPassword(1, cambioDto)).rejects.toThrow(ConflictException);
      expect(mockInversorRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('ingresarFondosTarjeta', () => {
    const tarjetaValida = {
      numeroTarjeta: '1234567812345678',
      cvv: '123',
      vencimiento: '12/30',
      monto: 5000
    };

    it('debería sumar el monto al saldo si la tarjeta es válida', async () => {
      const inversorSimulado = { id: 1, saldoVirtual: 1000 };
      mockInversorRepository.findOneBy.mockResolvedValue(inversorSimulado);

      const result = await service.ingresarFondosTarjeta(1, tarjetaValida);

      expect(result.saldoActual).toBe(6000);
      expect(mockInversorRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        saldoVirtual: 6000
      }));
    });

    it('debería lanzar BadRequestException si la tarjeta es inválida (vencimiento mal)', async () => {
      const tarjetaFalsa = { ...tarjetaValida, vencimiento: '13/25' };
      mockInversorRepository.findOneBy.mockResolvedValue({ id: 1 });

      await expect(service.ingresarFondosTarjeta(1, tarjetaFalsa)).rejects.toThrow(BadRequestException);
    });
  });

  describe('ingresarFondosTransferencia', () => {
    it('debería sumar los fondos mediante transferencia', async () => {
      const inversorSimulado = { id: 1, saldoVirtual: 1000 };
      mockInversorRepository.findOneBy.mockResolvedValue(inversorSimulado);

      const ingresarFondosTransf = { monto: 2000, cbu: "1231241241241234124122", titular: "alejo" };
      const result = await service.ingresarFondosTransferencia(1, ingresarFondosTransf);

      expect(result.saldoActual).toBe(3000);
      expect(mockInversorRepository.save).toHaveBeenCalled();
    });
  });

  describe('retirarFondos', () => {
    it('debería restar fondos si tiene saldo suficiente', async () => {
      const inversorSimulado = { id: 1, saldoVirtual: 5000 };
      mockInversorRepository.findOneBy.mockResolvedValue(inversorSimulado);

      const retirarFondosValido = { monto: 2000, cbu: "1231241241241234124122", titular: "alejo" }
      const result = await service.retirarFondos(1, retirarFondosValido);

      expect(result.saldoActual).toBe(3000);
      expect(mockInversorRepository.save).toHaveBeenCalled();
    });

    it('debería lanzar BadRequestException si el monto supera el saldo', async () => {
      const inversorSimulado = { id: 1, saldoVirtual: 100 };
      mockInversorRepository.findOneBy.mockResolvedValue(inversorSimulado);

      const retirarFondosInvalido = { monto: 500, cbu: "1231241241241234124122", titular: "alejo" };
      await expect(service.retirarFondos(1, retirarFondosInvalido)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Cálculos Financieros (Privados)', () => {
    
    it('calcularRendimientoTenencia debería calcular el porcentaje correctamente', () => {
      const mockTenencia = {
        precioCompra: 100,
        activo: { precioActual: 150 }
      };
      // Usamos (service as any) para acceder al método privado
      const resultado = (service as any).calcularRendimientoTenencia(mockTenencia);
      
      // ((150 - 100) / 100) * 100 = 50%
      expect(resultado).toBe(50);
    });

    it('calcularValorPortafolio debería sumar correctamente el valor total de activos', () => {
      const mockTenencias = [
        { cantidad: 2, activo: { precioActual: 100 } }, // 200
        { cantidad: 1, activo: { precioActual: 50 } },  // 50
      ];
      const resultado = (service as any).calcularValorPortafolio(mockTenencias);
      
      expect(resultado).toBe(250);
    });

    it('calcularRendimientoPortafolio debería devolver 0 si el costo es 0 o casi nulo', () => {
      const resultado = (service as any).calcularRendimientoPortafolio(1000, 0);
      expect(resultado).toBe(0);
    });

    it('calcularRendimientoPortafolio debería calcular la variación total', () => {
      // Valor: 120, Costo: 100 -> Rendimiento: 20%
      const resultado = (service as any).calcularRendimientoPortafolio(120, 100);
      expect(resultado).toBe(20);
    });
  });
});
