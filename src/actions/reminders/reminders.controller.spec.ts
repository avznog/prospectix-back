import { Test, TestingModule } from '@nestjs/testing';
import { RemindersService } from 'src/services/reminders/reminders.service';
import { RemindersController } from './reminders.controller';

describe('RemindersController', () => {
  let controller: RemindersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemindersController],
      providers: [RemindersService],
    }).compile();

    controller = module.get<RemindersController>(RemindersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
