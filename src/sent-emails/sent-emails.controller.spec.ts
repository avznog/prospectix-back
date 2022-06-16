import { Test, TestingModule } from '@nestjs/testing';
import { SentEmailsController } from './sent-emails.controller';
import { SentEmailsService } from './sent-emails.service';

describe('SentEmailsController', () => {
  let controller: SentEmailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentEmailsController],
      providers: [SentEmailsService],
    }).compile();

    controller = module.get<SentEmailsController>(SentEmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
