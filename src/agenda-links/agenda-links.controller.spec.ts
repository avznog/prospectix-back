import { Test, TestingModule } from '@nestjs/testing';
import { AgendaLinksController } from './agenda-links.controller';
import { AgendaLinksService } from './agenda-links.service';

describe('AgendaLinksController', () => {
  let controller: AgendaLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgendaLinksController],
      providers: [AgendaLinksService],
    }).compile();

    controller = module.get<AgendaLinksController>(AgendaLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
