import { Test, TestingModule } from '@nestjs/testing';
import { GoalTemplatesService } from './goal-templates.service';

describe('GoalTemplatesService', () => {
  let service: GoalTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalTemplatesService],
    }).compile();

    service = module.get<GoalTemplatesService>(GoalTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
