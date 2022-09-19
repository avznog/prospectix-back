import { Test, TestingModule } from '@nestjs/testing';
import { StatsHistoryController } from './stats-history.controller';
import { StatsHistoryService } from './stats-history.service';

describe('StatsHistoryController', () => {
  let controller: StatsHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsHistoryController],
      providers: [StatsHistoryService],
    }).compile();

    controller = module.get<StatsHistoryController>(StatsHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
