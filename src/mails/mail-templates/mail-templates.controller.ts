import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body, Delete, Param, Patch } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { CreateMailTemplateDto } from 'src/dto/mail-templates/create-mail-template.dto';
import { UpdateMailTemplateDto } from 'src/dto/mail-templates/update-mail-template.dto';
import { MailTemplate } from 'src/entities/mail-templates/mail-template.entity';
import { ProjectManager } from 'src/entities/project-managers/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { MailTemplatesService } from 'src/services/mail-templates/mail-templates.service';
import { SentryService } from 'src/services/sentry/sentry.service';

import { DeleteResult } from 'typeorm';

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