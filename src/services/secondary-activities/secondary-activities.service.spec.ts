import { Test, TestingModule } from '@nestjs/testing';
import { SecondaryActivitiesService } from './secondary-activities.service';

describe('SecondaryActivitiesService', () => {
  let service: SecondaryActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecondaryActivitiesService],
    }).compile();

    service = module.get<SecondaryActivitiesService>(SecondaryActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
