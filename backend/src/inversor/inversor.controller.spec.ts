import { Test, TestingModule } from '@nestjs/testing';
import { InversorController } from './inversor.controller';
import { InversorService } from './inversor.service';

describe('InversorController', () => {
  let controller: InversorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InversorController],
      providers: [InversorService],
    }).compile();

    controller = module.get<InversorController>(InversorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
