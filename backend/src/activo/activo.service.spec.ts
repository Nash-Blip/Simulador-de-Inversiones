import { Test, TestingModule } from '@nestjs/testing';
import { ActivoService } from './activo.service';
import { Repository } from 'typeorm';
import { Activo } from './entities/activo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateActivoDto } from './dto/create-activo.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ActivoService', () => {
  let service: ActivoService;
  let repository: Repository<Activo>;

  const mockActivoRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivoService,
        {
          provide: getRepositoryToken(Activo),
          useValue: mockActivoRepository,
        },
      ],
    }).compile();

    service = module.get<ActivoService>(ActivoService);
    repository = module.get<Repository<Activo>>(getRepositoryToken(Activo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createActivoDto: CreateActivoDto = {
      nombre: 'Bitcoin',
      ticker: 'BTC',
      precioInicial: 50000,
    };

    it('debería crear y retornar un activo exitosamente si no existe', async () => {
      mockActivoRepository.findOneBy.mockResolvedValue(null);
      mockActivoRepository.create.mockReturnValue(createActivoDto);
      mockActivoRepository.save.mockResolvedValue({ id: 1, ...createActivoDto });

      const result = await service.create(createActivoDto);

      expect(mockActivoRepository.findOneBy).toHaveBeenCalledWith({ nombre: createActivoDto.nombre });
      
      expect(mockActivoRepository.create).toHaveBeenCalledWith({
        nombre: createActivoDto.nombre,
        ticker: createActivoDto.ticker,
        precioInicial: createActivoDto.precioInicial,
        precioActual: createActivoDto.precioInicial,
        valorMaximo: createActivoDto.precioInicial,
        valorMinimo: createActivoDto.precioInicial, 
        cantOperaciones: 0,
        totalEjecutado: 0,
      });
      
      expect(mockActivoRepository.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1, ...createActivoDto });
    });

    it('debería lanzar un ConflictException si el activo ya existe', async () => {
      mockActivoRepository.findOneBy.mockResolvedValue({ id: 1, nombre: 'Bitcoin' });

      await expect(service.create(createActivoDto)).rejects.toThrow(ConflictException);
      expect(mockActivoRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('debería retornar un array de activos', async () => {
      const mockActivos = [{ id: 1, nombre: 'Bitcoin' }, { id: 2, nombre: 'Ethereum' }];
      mockActivoRepository.find.mockResolvedValue(mockActivos);

      const result = await service.findAll();

      expect(mockActivoRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockActivos);
    });
  });

  describe('findOne', () => {
    it('debería retornar un activo si lo encuentra', async () => {
      const mockActivo = { id: 1, nombre: 'Bitcoin', transacciones: [] };
      mockActivoRepository.findOne.mockResolvedValue(mockActivo);

      const result = await service.findOne(1);

      expect(mockActivoRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['transacciones'],
      });
      expect(result).toEqual(mockActivo);
    });

    it('debería lanzar un NotFoundException si el activo no existe', async () => {
      mockActivoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
