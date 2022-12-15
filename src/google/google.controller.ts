import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';
import { SentryInterceptor } from 'src/sentry.interceptor';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseInterceptors(SentryInterceptor)
@Controller('google')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  test() {
    return this.googleService.test();
  }

  @Get("add-event")
  addEvent() {
    return this.googleService.addEvent();
  }
}
