import { Test, TestingModule } from '@nestjs/testing';
import { ProjectManagersService } from './project-managers.service';

describe('ProjectManagersService', () => {
  let service: ProjectManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectManagersService],
    }).compile();

    service = module.get<ProjectManagersService>(ProjectManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
