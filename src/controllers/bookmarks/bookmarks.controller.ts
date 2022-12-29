import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateBookmarkDto } from 'src/dto/bookmarks/create-bookmark.dto';
import { ResearchParamsBookmarksDto } from 'src/dto/bookmarks/research-params-bookmarks.dto';
import { Bookmark } from 'src/entities/bookmarks/bookmark.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { BookmarksService } from 'src/services/bookmarks/bookmarks.service';
import { DeleteResult } from 'typeorm';

@UseInterceptors(SentryInterceptor)
@Controller('bookmarks')
@ApiTags("bookmarks")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto, @CurrentUser() user) : Promise<Bookmark> {
    return this.bookmarksService.create(createBookmarkDto, user.id);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("/:idBookmark")
  delete(@Param("idBookmark") idBookmark : number) : Promise<DeleteResult> {
    return this.bookmarksService.delete(idBookmark);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsBookmarksDto: ResearchParamsBookmarksDto, @CurrentUser() user: ProjectManager) {
    return this.bookmarksService.findAllPaginated(researchParamsBookmarksDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-bookmarks")
  countBookmarks(@Query() researchParamsBookmarksDto: ResearchParamsBookmarksDto, @CurrentUser() user: ProjectManager) : Promise<number> {
    return this.bookmarksService.countBookmarks(researchParamsBookmarksDto, user);
  }
}
