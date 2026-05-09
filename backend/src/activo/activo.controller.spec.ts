import { Test, TestingModule } from '@nestjs/testing';
import { ActivoController } from './activo.controller';
import { ActivoService } from './activo.service';

describe('ActivoController', () => {
  let controller: ActivoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivoController],
      providers: [ActivoService],
    }).compile();

    controller = module.get<ActivoController>(ActivoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
