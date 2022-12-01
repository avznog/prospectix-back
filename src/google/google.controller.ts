import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';
import { SentryInterceptor } from 'src/sentry.interceptor';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseInterceptors(SentryInterceptor)
@Controller('google')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  create(@Body() createGoogleDto: CreateGoogleDto) {
    return this.googleService.create(createGoogleDto);
  }

  @Get()
  findAll() {
    return this.googleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoogleDto: UpdateGoogleDto) {
    return this.googleService.update(+id, updateGoogleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleService.remove(+id);
  }
}
