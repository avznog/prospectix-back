import { Test, TestingModule } from '@nestjs/testing';
import { MailTemplatesService } from 'src/services/mail-templates/mail-templates.service';
import { MailTemplatesController } from './mail-templates.controller';

describe('MailTemplatesController', () => {
  let controller: MailTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailTemplatesController],
      providers: [MailTemplatesService],
    }).compile();

    controller = module.get<MailTemplatesController>(MailTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
