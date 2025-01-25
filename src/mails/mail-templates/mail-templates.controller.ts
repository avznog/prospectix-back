import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body, Delete, Param, Patch } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { SentryService } from '../../apis/sentry/sentry.service';
import { Roles } from '../../auth/annotations/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.model';
import JwtAuthGuard from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { RolesType } from '../../auth/role.type';
import { CreateMailTemplateDto } from '../../mails/mail-templates/dto/create-mail-template.dto';
import { MailTemplate } from '../../mails/mail-templates/entities/mail-template.entity';
import { SentryInterceptor } from '../../sentry.interceptor';
import { ProjectManager } from '../../users/project-managers/entities/project-manager.entity';
import { DeleteResult } from 'typeorm';
import { UpdateMailTemplateDto } from './dto/update-mail-template.dto';
import { MailTemplatesService } from './mail-templates.service';

@Controller('mail-templates')
@UseInterceptors(SentryInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("mail-templates")
export class MailTemplatesController {
  constructor(
    private readonly mailTemplatesService: MailTemplatesService,
    private readonly sentryService: SentryService
    ) {}

  @Get()
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllForMe(@CurrentUser() user: ProjectManager) : Promise<MailTemplate[]> {
    this.sentryService.setSentryUser(user);
    return this.mailTemplatesService.findAllForMe(user);
  }

  @Post()
  @Roles(RolesType.CDP, RolesType.ADMIN)
  create(@Body() createMailTemplateDto: CreateMailTemplateDto, @CurrentUser() user: ProjectManager) : Promise<MailTemplate> {
    this.sentryService.setSentryUser(user);
    return this.mailTemplatesService.create(createMailTemplateDto, user);
  }

  @Delete(":id")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  delete(@Param("id") id: number, @CurrentUser() user: ProjectManager) : Promise<DeleteResult> {
    this.sentryService.setSentryUser(user);
    return this.mailTemplatesService.delete(id);
  }

  @Patch(":id")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  update(@Param("id") id: number, @Body() updateMailTemplateDto: UpdateMailTemplateDto, @CurrentUser() user: ProjectManager) : Promise<MailTemplate> {
    this.sentryService.setSentryUser(user);
    return this.mailTemplatesService.update(id, updateMailTemplateDto)
  }

  @Get("all")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAll(@CurrentUser() user: ProjectManager) : Promise<MailTemplate[]> {
    this.sentryService.setSentryUser(user);
    return this.mailTemplatesService.findAll();
  }
}