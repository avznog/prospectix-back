import { Test, TestingModule } from '@nestjs/testing';
import { NegativeAnswersService } from './negative-answers.service';

describe('NegativeAnswersService', () => {
  let service: NegativeAnswersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NegativeAnswersService],
    }).compile();

    service = module.get<NegativeAnswersService>(NegativeAnswersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
