import { Test, TestingModule } from '@nestjs/testing';
import { InversorService } from './inversor.service';

describe('InversorService', () => {
  let service: InversorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InversorService],
    }).compile();

    service = module.get<InversorService>(InversorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
