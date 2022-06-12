import { Test, TestingModule } from '@nestjs/testing';
import { ProjectManagerController } from './project-manager.controller';
import { ProjectManagerService } from './project-manager.service';

describe('ProjectManagerController', () => {
  let controller: ProjectManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectManagerController],
      providers: [ProjectManagerService],
    }).compile();

    controller = module.get<ProjectManagerController>(ProjectManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
