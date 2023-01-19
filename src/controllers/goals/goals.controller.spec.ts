import { Test, TestingModule } from '@nestjs/testing';
import { GoalsService } from 'src/services/goals/goals.service';
import { GoalsController } from './goals.controller';

describe('GoalsController', () => {
  let controller: GoalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsController],
      providers: [GoalsService],
    }).compile();

    controller = module.get<GoalsController>(GoalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
