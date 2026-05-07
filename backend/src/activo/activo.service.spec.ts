import { Test, TestingModule } from '@nestjs/testing';
import { ActivoService } from './activo.service';

describe('ActivoService', () => {
  let service: ActivoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivoService],
    }).compile();

    service = module.get<ActivoService>(ActivoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
