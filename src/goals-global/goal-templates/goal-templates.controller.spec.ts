import { Test, TestingModule } from '@nestjs/testing';
import { GoalTemplatesService } from 'src/services/goal-templates/goal-templates.service';
import { GoalTemplatesController } from './goal-templates.controller';

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
