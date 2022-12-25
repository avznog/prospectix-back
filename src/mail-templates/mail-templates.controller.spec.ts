import { Test, TestingModule } from '@nestjs/testing';
import { MailTemplatesController } from './mail-templates.controller';
import { MailTemplatesService } from './mail-templates.service';

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
