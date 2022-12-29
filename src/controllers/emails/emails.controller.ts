import { Body, Controller, Param, Patch, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/annotations/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesType } from 'src/auth/role.type';
import { UpdateEmailDto } from 'src/dto/emails/update-email.dto';
import { SentryInterceptor } from 'src/sentry.interceptor';
import { EmailsService } from 'src/services/emails/emails.service';
import { UpdateResult } from 'typeorm';

@UseInterceptors(SentryInterceptor)
@Controller('emails')
@ApiTags("emails")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Roles(RolesType.CDP, RolesType.ADMIN)
  @Patch(":id")
  update(@Param("id") idEmail: number, @Body() updateEmailDto: UpdateEmailDto) : Promise<UpdateResult> {
    return this.emailsService.update(idEmail, updateEmailDto);
  }
}
