import { Test, TestingModule } from '@nestjs/testing';
import { TransaccionService } from './transaccion.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipoTransaccion, Transaccion } from './transaccion.entity';
import { Repository } from 'typeorm';
import { GetTransaccionesQueryDto } from './dto/input/get-transaccion-query.dto';
import { Portafolio } from '@/portafolio/portafolio.entity';
import { Activo } from '@/activo/entities/activo.entity';

describe('TransaccionService', () => {
  let service: TransaccionService;
  let repository: Repository<Transaccion>;

  // Armamos el mock del QueryBuilder encadenado
  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockTransaccionRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransaccionService,
        {
          provide: getRepositoryToken(Transaccion),
          useValue: mockTransaccionRepository,
        },
      ],
    }).compile();

    service = module.get<TransaccionService>(TransaccionService);
    repository = module.get<Repository<Transaccion>>(getRepositoryToken(Transaccion));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debería retornar datos paginados y mapeados por defecto (Página 1)', async () => {
      const queryDto: GetTransaccionesQueryDto = { page: 1 } as any;
      const mockTransacciones = [
        { id: 1, tipoTransaccion: TipoTransaccion.COMPRA, cantidad: 10, precioEjecutado: 500, fecha: new Date(), activo: { ticker: 'AAPL', nombre: 'Apple Inc.' } }
      ];
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockTransacciones, 1]);

      const result = await service.findAll(queryDto);

      expect(mockTransaccionRepository.createQueryBuilder).toHaveBeenCalledWith('transaccion');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('transaccion.activo', 'activo');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      
      expect(result.data[0].ticker).toBe('AAPL');
      expect(result.data[0].nombre).toBe('Apple Inc.');
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.currentPage).toBe(1);
    });

    it('debería calcular el skip correcto para páginas avanzadas', async () => {
      const queryDto: GetTransaccionesQueryDto = { page: 3 } as any;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 25]);

      const result = await service.findAll(queryDto);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(20);
      expect(result.meta.totalPages).toBe(3);
    });

    it('debería aplicar todos los filtros condicionales', async () => {
      const queryDto: GetTransaccionesQueryDto = {
        page: 1,
        tipoTransaccion: TipoTransaccion.COMPRA,
        fechaInicio: '2026-01-01',
        fechaFin: '2026-01-05',
        search: 'Apple'
      } as any;

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findAll(queryDto);

      // Verificamos que se hayan llamado los andWhere correspondientes
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaccion.tipoTransaccion = :tipo',
        { tipo: TipoTransaccion.COMPRA }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaccion.fecha BETWEEN :inicio AND :fin',
        expect.objectContaining({
          inicio: expect.any(Date),
          fin: expect.any(Date)
        })
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(activo.ticker ILIKE :search OR activo.nombre ILIKE :search)',
        { search: '%Apple%' }
      );
    });
  });

  describe('findHistorialTransacciones', () => {
    it('debería filtrar por el inversorId correspondiente usando leftJoins', async () => {
      const queryDto: GetTransaccionesQueryDto = { page: 1 } as any;
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      await service.findHistorialTransacciones(42, queryDto);

      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('transaccion.portafolio', 'portafolio');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('portafolio.inversor', 'inversor');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('inversor.id = :inversorId', { inversorId: 42 });
    });
  });

  describe('create', () => {
    it('debería guardar una nueva transacción correctamente', async () => {
      const mockPortafolio = { id: 10 } as Portafolio;
      const mockActivo = { id: 2, ticker: 'TSLA' } as Activo;
      const transaccionInstancia = { id: 500 };

      mockTransaccionRepository.create.mockReturnValue(transaccionInstancia);
      mockTransaccionRepository.save.mockResolvedValue(transaccionInstancia);

      const result = await service.create(
        TipoTransaccion.COMPRA,
        5,
        1500,
        mockPortafolio,
        mockActivo
      );

      expect(mockTransaccionRepository.create).toHaveBeenCalledWith({
        tipoTransaccion: TipoTransaccion.COMPRA,
        cantidad: 5,
        precioEjecutado: 1500,
        portafolio: mockPortafolio,
        activo: mockActivo,
      });
      expect(mockTransaccionRepository.save).toHaveBeenCalledWith(transaccionInstancia);
      expect(result.id).toBe(500);
    });
  });
});