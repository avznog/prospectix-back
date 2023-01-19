import { Test, TestingModule } from '@nestjs/testing';
import { SentEmailsService } from './sent-emails.service';

describe('SentEmailsService', () => {
  let service: SentEmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentEmailsService],
    }).compile();

    service = module.get<SentEmailsService>(SentEmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
