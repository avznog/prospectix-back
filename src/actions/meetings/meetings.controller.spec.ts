import { Test, TestingModule } from '@nestjs/testing';
import { MeetingsService } from 'src/services/meetings/meetings.service';
import { MeetingsController } from './meetings.controller';

describe('MeetingsController', () => {
  let controller: MeetingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingsController],
      providers: [MeetingsService],
    }).compile();

    controller = module.get<MeetingsController>(MeetingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
