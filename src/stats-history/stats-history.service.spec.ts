import { Test, TestingModule } from '@nestjs/testing';
import { StatsHistoryService } from './stats-history.service';

describe('StatsHistoryService', () => {
  let service: StatsHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatsHistoryService],
    }).compile();

    service = module.get<StatsHistoryService>(StatsHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
