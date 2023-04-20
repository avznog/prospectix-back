import { Test, TestingModule } from '@nestjs/testing';
import { PrimaryActivityService } from './primary-activity.service';

describe('PrimaryActivityService', () => {
  let service: PrimaryActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrimaryActivityService],
    }).compile();

    service = module.get<PrimaryActivityService>(PrimaryActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
