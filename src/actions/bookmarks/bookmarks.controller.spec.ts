import { Test, TestingModule } from '@nestjs/testing';
import { BookmarksService } from 'src/services/bookmarks/bookmarks.service';
import { BookmarksController } from './bookmarks.controller';

describe('BookmarksController', () => {
  let controller: BookmarksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarksController],
      providers: [BookmarksService],
    }).compile();

    controller = module.get<BookmarksController>(BookmarksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
