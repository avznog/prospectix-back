import { Test, TestingModule } from '@nestjs/testing';
import { PrimaryActivityController } from './primary-activity.controller';

describe('PrimaryActivityController', () => {
  let controller: PrimaryActivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrimaryActivityController],
    }).compile();

    controller = module.get<PrimaryActivityController>(PrimaryActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
