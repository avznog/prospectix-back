import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { ApiTags } from '@nestjs/swagger';
import JwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/annotations/roles.decorator';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateResult } from 'typeorm';

@Controller('emails')
@ApiTags("emails")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Roles("Cdp","Admin")
  @Patch(":id")
  update(@Param("id") idEmail: number, @Body() updateEmailDto: UpdateEmailDto) : Promise<UpdateResult> {
    return this.emailsService.update(idEmail, updateEmailDto);
  }
}
