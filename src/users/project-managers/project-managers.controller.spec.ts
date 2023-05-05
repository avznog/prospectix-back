import { Test, TestingModule } from '@nestjs/testing';
import { ProjectManagersService } from 'src/services/project-managers/project-managers.service';
import { ProjectManagersController } from './project-managers.controller';

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
