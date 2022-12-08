import { Test, TestingModule } from '@nestjs/testing';
import { GoalTemplatesController } from './goal-templates.controller';
import { GoalTemplatesService } from './goal-templates.service';

describe('GoalTemplatesController', () => {
  let controller: GoalTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalTemplatesController],
      providers: [GoalTemplatesService],
    }).compile();

    controller = module.get<GoalTemplatesController>(GoalTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
