import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { DeleteResult } from 'typeorm';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { ResearchParamsBookmarksDto } from './dto/research-params-bookmarks.dto';
import { Bookmark } from './entities/bookmark.entity';

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
}
