import { Test, TestingModule } from '@nestjs/testing';
import { ProjectManagersController } from './project-managers.controller';
import { ProjectManagersService } from './project-managers.service';

describe('ProjectManagersController', () => {
  let controller: ProjectManagersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectManagersController],
      providers: [ProjectManagersService],
    }).compile();

    controller = module.get<ProjectManagersController>(ProjectManagersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
