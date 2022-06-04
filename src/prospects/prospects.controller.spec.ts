import { Test, TestingModule } from '@nestjs/testing';
import { ProspectsController } from './prospects.controller';
import { ProspectsService } from './prospects.service';

describe('ProspectsController', () => {
  let controller: ProspectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProspectsController],
      providers: [ProspectsService],
    }).compile();

    controller = module.get<ProspectsController>(ProspectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
