import { Test, TestingModule } from '@nestjs/testing';
import { SistemaController } from './sistema.controller';
import { SistemaService } from './sistema.service';

describe('SistemaController', () => {
  let controller: SistemaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SistemaController],
      providers: [SistemaService],
    }).compile();

    controller = module.get<SistemaController>(SistemaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
