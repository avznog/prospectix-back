import { Test, TestingModule } from '@nestjs/testing';
import { ProspectsService } from 'src/services/prospects/prospects.service';
import { ProspectsController } from './prospects.controller';

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
