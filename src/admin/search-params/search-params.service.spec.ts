import { Test, TestingModule } from '@nestjs/testing';
import { SearchParamsService } from './search-params.service';

describe('SearchParamsService', () => {
  let service: SearchParamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchParamsService],
    }).compile();

    service = module.get<SearchParamsService>(SearchParamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
