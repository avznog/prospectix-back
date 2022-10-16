import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { SentEmailsService } from './sent-emails.service';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { RolesType } from 'src/auth/role.type';
import { ResearchParamsSentEmailsDto } from './dto/research-params-sent-emails.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { CreateSentEmailDto } from './dto/create-sent-email.dto';
import { SentEmail } from './entities/sent-email.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';

@UseInterceptors(SentryInterceptor)
@Controller('sent-emails')
@ApiTags("sent-emails")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SentEmailsController {
  constructor(private readonly sentEmailsService: SentEmailsService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("find-all-paginated")
  findAllPaginated(@Query() researchParamsSentEmailsDto: ResearchParamsSentEmailsDto, @CurrentUser() user: ProjectManager) {
    return this.sentEmailsService.findAllPaginated(researchParamsSentEmailsDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Post()
  create(@Body() createSentEmailDto: CreateSentEmailDto, @CurrentUser() user) : Promise<SentEmail> {
    return this.sentEmailsService.create(createSentEmailDto, user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-sent-emails")
  countSentEmails(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.sentEmailsService.countSentEmails(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-for-me")
  countAllForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.sentEmailsService.countAllForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all")
  countAll(@Query() interval: { dateDown: Date, dateUp: Date }) {
    return this.sentEmailsService.countAll(interval);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-weekly-for-me")
  countWeeklyForMe(@CurrentUser() user: ProjectManager) : Promise<number> {
    return this.sentEmailsService.countWeeklyForMe(user);
  }

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("count-all-by-weeks-for-me")
  countAllByWeeksForMe(@CurrentUser() user: ProjectManager) {
    return this.sentEmailsService.countAllByWeeksForMe(user);
  }
}
