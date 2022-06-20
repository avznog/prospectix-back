import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';

@Controller('bookmarks')
@ApiTags("bookmarks")
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}
}
