import { Test, TestingModule } from '@nestjs/testing';
import { InversorService } from './inversor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inversor, InversorRol } from './entities/inversor.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
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
  });

  describe('onApplicationBootstrap', () => {
    it('debería crear un admin si no hay usuarios en el sistema', async () => {
      mockInversorRepository.count.mockResolvedValue(0);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');
      
      await service.onApplicationBootstrap();

      expect(mockInversorRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        email: "pruebasAdmin@mail.com",
        rol: InversorRol.ADMIN
      }));
      expect(mockInversorRepository.save).toHaveBeenCalled();
    });

    it('no debería hacer nada si ya existen usuarios', async () => {
      mockInversorRepository.count.mockResolvedValue(5);
      await service.onApplicationBootstrap();
      expect(mockInversorRepository.create).not.toHaveBeenCalled();
    });
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
    it('debería retornar el portafolio con sus relaciones', async () => {
      const mockInversor = { id: 1, portafolio: { valorPortafolio: 500 } };
      mockInversorRepository.findOne.mockResolvedValue(mockInversor);

      const result = await service.findPortafolio(1);

      expect(result).toEqual(mockInversor.portafolio);
      expect(mockInversorRepository.findOne).toHaveBeenCalledWith(expect.objectContaining({
        relations: expect.any(Object)
      }));
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
});
