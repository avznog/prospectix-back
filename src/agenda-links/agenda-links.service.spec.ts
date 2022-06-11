import { Test, TestingModule } from '@nestjs/testing';
import { AgendaLinksService } from './agenda-links.service';

describe('AgendaLinksService', () => {
  let service: AgendaLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgendaLinksService],
    }).compile();

    service = module.get<AgendaLinksService>(AgendaLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
