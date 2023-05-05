import { Test, TestingModule } from '@nestjs/testing';
import { SecondaryActivitiesService } from 'src/services/secondary-activities/secondary-activities.service';
import { SecondaryActivitiesController as SecondaryActivitiesController } from './secondary-activities.controller';

describe('SecondaryActivitiesController', () => {
  let controller: SecondaryActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecondaryActivitiesController],
      providers: [SecondaryActivitiesService],
    }).compile();

    controller = module.get<SecondaryActivitiesController>(SecondaryActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
