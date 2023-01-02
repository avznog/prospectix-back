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
import { SentryService } from 'src/services/sentry/sentry/sentry.service';
import { DeleteResult } from 'typeorm';

@UseInterceptors(SentryInterceptor)
@Controller('bookmarks')
@ApiTags("bookmarks")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookmarksController {
  constructor(
    private readonly bookmarksService: BookmarksService,
    private readonly sentryService: SentryService
  ) { }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto, @CurrentUser() user: ProjectManager): Promise<Bookmark> {
    this.sentryService.setSentryUser(user)
    return this.bookmarksService.create(createBookmarkDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("/:idBookmark")
  delete(@Param("idBookmark") idBookmark: number, @CurrentUser() user: ProjectManager): Promise<DeleteResult> {
    this.sentryService.setSentryUser(user);
    return this.bookmarksService.delete(idBookmark);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsBookmarksDto: ResearchParamsBookmarksDto, @CurrentUser() user: ProjectManager) {
    this.sentryService.setSentryUser(user);
    return this.bookmarksService.findAllPaginated(researchParamsBookmarksDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-bookmarks")
  countBookmarks(@Query() researchParamsBookmarksDto: ResearchParamsBookmarksDto, @CurrentUser() user: ProjectManager): Promise<number> {
    this.sentryService.setSentryUser(user);
    return this.bookmarksService.countBookmarks(researchParamsBookmarksDto, user);
  }
}