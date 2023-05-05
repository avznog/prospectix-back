import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookmarkDto } from 'src/actions/bookmarks/dto/create-bookmark.dto';
import { Bookmark } from 'src/actions/bookmarks/entities/bookmark.entity';
import { SentryService } from 'src/apis/sentry/sentry.service';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { ProjectManager } from 'src/users/project-managers/entities/project-manager.entity';
import { DeleteResult } from 'typeorm';
import { BookmarksService } from './bookmarks.service';
import { ResearchParamsBookmarksDto } from './dto/research-params-bookmarks.dto';

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
  findAllPaginated(@Query() researchParamsBookmarksDto: ResearchParamsBookmarksDto, @CurrentUser() user: ProjectManager) : Promise<{bookmarks: Bookmark[], count: number}> {
    this.sentryService.setSentryUser(user);
    return this.bookmarksService.findAllPaginated(researchParamsBookmarksDto, user);
  }
}
