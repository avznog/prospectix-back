import { Test, TestingModule } from '@nestjs/testing';
import { SentEmailsService } from 'src/services/sent-emails/sent-emails.service';
import { SentEmailsController } from './sent-emails.controller';

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
