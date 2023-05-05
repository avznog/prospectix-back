import { Test, TestingModule } from '@nestjs/testing';
import { EmailsService } from 'src/services/emails/emails.service';
import { EmailsController } from './emails.controller';

describe('EmailsController', () => {
  let controller: EmailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailsController],
      providers: [EmailsService],
    }).compile();

    controller = module.get<EmailsController>(EmailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
