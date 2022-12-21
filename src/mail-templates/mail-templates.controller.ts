import { Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Body, Delete, Param, Patch } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.model';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { ProjectManager } from 'src/project-managers/entities/project-manager.entity';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { DeleteResult } from 'typeorm';
import { CreateMailTemplateDto } from './dto/create-mail-template.dto';
import { UpdateMailTemplateDto } from './dto/update-mail-template.dto';
import { MailTemplate } from './entities/mail-template.entity';
import { MailTemplatesService } from './mail-templates.service';

@Controller('mail-templates')
@UseInterceptors(SentryInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("mail-templates")
export class MailTemplatesController {
  constructor(
    private readonly mailTemplatesService: MailTemplatesService
    ) {}

  @Get()
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAllForMe(@CurrentUser() pm: ProjectManager) : Promise<MailTemplate[]> {
    return this.mailTemplatesService.findAllForMe(pm);
  }

  @Post()
  @Roles(RolesType.CDP, RolesType.ADMIN)
  create(@Body() createMailTemplateDto: CreateMailTemplateDto, @CurrentUser() pm: ProjectManager) : Promise<MailTemplate> {
    return this.mailTemplatesService.create(createMailTemplateDto, pm);
  }

  @Delete(":id")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  delete(@Param("id") id: number) : Promise<DeleteResult> {
    return this.mailTemplatesService.delete(id);
  }

  @Patch(":id")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  update(@Param("id") id: number, @Body() updateMailTemplateDto: UpdateMailTemplateDto) : Promise<MailTemplate> {
    return this.mailTemplatesService.update(id, updateMailTemplateDto)
  }

  @Get("all")
  @Roles(RolesType.CDP, RolesType.ADMIN)
  findAll() : Promise<MailTemplate[]> {
    return this.mailTemplatesService.findAll();
  }

  // ! TO DELETE
  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Get("templates")
  templates() {
    return this.mailTemplatesService.test();
  }
}