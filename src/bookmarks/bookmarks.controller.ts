import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { DeleteResult } from 'typeorm';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Bookmark } from './entities/bookmark.entity';

@Controller('bookmarks')
@ApiTags("bookmarks")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}
  
  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete(":id")
  delete(@Param("id") idBookmark: number) : Promise<DeleteResult> {
    return this.bookmarksService.delete(idBookmark);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createBookmarkDto: CreateBookmarkDto) : Promise<Bookmark> {
    return this.bookmarksService.create(createBookmarkDto);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Delete("by-prospect/:idProspect")
  deleteByProspect(@Param("idProspect") idProspect: number) : Promise<DeleteResult> {
    return this.bookmarksService.deleteByProspect(idProspect);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("")
  findAll() {
    return this.bookmarksService.findAll()
  }
}
